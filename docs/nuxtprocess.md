# nuxi build

**Code Reference:** `packages/nuxi/src/commands/build.ts`

```ts
import type { Nitro } from 'nitropack'

import process from 'node:process'

import { defineCommand } from 'citty'
import { relative, resolve } from 'pathe'

import { showVersions } from '../utils/banner'
import { overrideEnv } from '../utils/env'
import { clearBuildDir } from '../utils/fs'
import { loadKit } from '../utils/kit'
import { logger } from '../utils/logger'
import { cwdArgs, dotEnvArgs, envNameArgs, extendsArgs, legacyRootDirArgs, logLevelArgs } from './_shared'


export default defineCommand({
  meta: {
    name: 'build',
    description: 'Build Nuxt for production deployment',
  },
  args: {
    ...cwdArgs,
    ...logLevelArgs,
    prerender: {
      type: 'boolean',
      description: 'Build Nuxt and prerender static routes',
    },
    preset: {
      type: 'string',
      description: 'Nitro server preset',
    },
    ...dotEnvArgs,
    ...envNameArgs,
    ...extendsArgs,
    ...legacyRootDirArgs,
  },
  async run(ctx) {
    overrideEnv('production')

    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir)

    showVersions(cwd)

    const kit = await loadKit(cwd)

    const nuxt = await kit.loadNuxt({
      cwd,
      dotenv: {
        cwd,
        fileName: ctx.args.dotenv,
      },
      envName: ctx.args.envName, // c12 will fall back to NODE_ENV
      overrides: {
        logLevel: ctx.args.logLevel as 'silent' | 'info' | 'verbose',
        // TODO: remove in 3.8
        _generate: ctx.args.prerender,
        nitro: {
          static: ctx.args.prerender,
          preset: ctx.args.preset || process.env.NITRO_PRESET || process.env.SERVER_PRESET,
        },
        ...(ctx.args.extends && { extends: ctx.args.extends }),
        ...ctx.data?.overrides,
      },
    })

    let nitro: Nitro | undefined
    // In Bridge, if Nitro is not enabled, useNitro will throw an error
    try {
      // Use ? for backward compatibility for Nuxt <= RC.10
      nitro = kit.useNitro?.()
      logger.info(`Building for Nitro preset: \`${nitro.options.preset}\``)
    }
    catch {
      //
    }

    await clearBuildDir(nuxt.options.buildDir)

    await kit.writeTypes(nuxt)

    nuxt.hook('build:error', (err) => {
      logger.error('Nuxt Build Error:', err)
      process.exit(1)
    })

    await kit.buildNuxt(nuxt)

    if (ctx.args.prerender) {
      if (!nuxt.options.ssr) {
        logger.warn(
          'HTML content not prerendered because `ssr: false` was set. You can read more in `https://nuxt.com/docs/getting-started/deployment#static-hosting`.',
        )
      }
      // TODO: revisit later if/when nuxt build --prerender will output hybrid
      const dir = nitro?.options.output.publicDir
      const publicDir = dir ? relative(process.cwd(), dir) : '.output/public'
      logger.success(
        `You can now deploy \`${publicDir}\` to any static hosting!`,
      )
    }
  },
})
```

---

**Key lines:**

1. `const kit = await loadKit(cwd)` -> dynamically import the @nuxt/kit package.
2. `const nuxt = await kit.loadNuxt({...})` -> using @nuxt/kit, construct main nuxt object, uses c12 to load config from user’s nuxt.config.ts

The nuxt object is the fully-resolved "single source of truth" for the entire build process. It is an instance of the Nuxt interface defined in @nuxt/schema. Nuxt modules can access it via the useNuxt() composable from @nuxt/kit, allowing them to read the configuration and modify it programmatically through hooks.

3. `await kit.writeTypes(nuxt)`: generates the initial set of TS definition files within .nuxt, including nuxt.d.ts, which provides types for the Nuxt context, and tsconfig.json files that configure TS for the project, including all the necessary path aliases
4. `await kit.buildNuxt(nuxt)`: core build logic responsible for initializing modules, generating all necessary application templates, and invoking Vite to compile the client and server assets into the .nuxt folder.

`.nuxt` folder: Virtual Application Graph

Nuxt's features, such as file-based routing (pages/), automatic imports (components/), and a plugin system (plugins/), provide a high-level way to structure an application. However, Vite needs explicit entry points and import statements, so Nuxt generates the necessary low-level boilerplate code into the `.nuxt` directory.

To make these generated files accessible within the user's application and the rest of the generated VFS, Nuxt configures a special path alias, `#build`, which points directly to the `<rootDir>/.nuxt` directory.

Once the `.nuxt` directory has been fully populated with the materialized application graph, the build process enters the bundling stage. Here, Nuxt hands off control to a Vite to compile, optimize, and package the application's source code into assets suitable for production using `@nuxt/vite-builder`.

With the Vite bundling stage complete, the `.nuxt/dist` directory contains the compiled assets for both the client and the server. This is handed off to the Nitro server engine.

The final, deployable artifact of the entire Nuxt build process is placed in the `.output` directory. This directory contains everything needed for production and is the only folder that needs to be deployed.

**Rendering strategy:** Server-Side Rendering (SSR), Single Page Application (SPA), and Static Site Generation (SSG)

---

**Code reference:** `packages/nuxi/src/commands/build.ts`

```ts
import { pathToFileURL } from 'node:url'
import type { Nuxt, NuxtConfig } from '@nuxt/schema'
import { resolve } from 'pathe'
import { resolveModulePath } from 'exsolve'
import { interopDefault } from 'mlly'
import { directoryToURL, importModule, tryImportModule } from '../internal/esm'
import { runWithNuxtContext } from '../context'
import type { LoadNuxtConfigOptions } from './config'

export interface LoadNuxtOptions extends LoadNuxtConfigOptions {
  /** Load nuxt with development mode */
  dev?: boolean

  /** Use lazy initialization of nuxt if set to false */
  ready?: boolean
}

export async function loadNuxt (opts: LoadNuxtOptions): Promise<Nuxt> {
  // Backward compatibility
  opts.cwd = resolve(opts.cwd || (opts as any).rootDir /* backwards compat */ || '.')
  opts.overrides ||= (opts as any).config as NuxtConfig /* backwards compat */ || {}

  // Apply dev as config override
  opts.overrides.dev = !!opts.dev

  const resolvedPath = ['nuxt-nightly', 'nuxt']
    .map(pkg => resolveModulePath(pkg, { try: true, from: [directoryToURL(opts.cwd!)] }))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .sort((a, b) => b.length - a.length)[0]

  if (!resolvedPath) {
    throw new Error(`Cannot find any nuxt version from ${opts.cwd}`)
  }
  const { loadNuxt } = await import(pathToFileURL(resolvedPath).href).then(r => interopDefault(r)) as typeof import('nuxt')
  const nuxt = await loadNuxt(opts)
  return nuxt
}

export async function buildNuxt (nuxt: Nuxt): Promise<any> {
  const rootURL = directoryToURL(nuxt.options.rootDir)

  const { build } = await tryImportModule<typeof import('nuxt')>('nuxt-nightly', { url: rootURL }) || await importModule<typeof import('nuxt')>('nuxt', { url: rootURL })
  return runWithNuxtContext(nuxt, () => build(nuxt))
}
```

---

**Code reference:** `packages/nuxt/src/core/nuxt.ts`

```ts
export async function loadNuxt (opts: LoadNuxtOptions): Promise<Nuxt> {
  const options = await loadNuxtConfig(opts)

  // Temporary until finding better placement for each
  options.appDir = options.alias['#app'] = withTrailingSlash(resolve(distDir, 'app'))
  options._majorVersion = 4

  // De-duplicate key arrays
  for (const key in options.app.head || {}) {
    options.app.head[key as 'link'] = deduplicateArray(options.app.head[key as 'link'])
  }

  // Nuxt DevTools only works for Vite
  if (options.builder === '@nuxt/vite-builder') {
    const isDevToolsEnabled = typeof options.devtools === 'boolean'
      ? options.devtools
      : options.devtools?.enabled !== false // enabled by default unless explicitly disabled

    if (isDevToolsEnabled) {
      if (!options._modules.some(m => m === '@nuxt/devtools' || m === '@nuxt/devtools-nightly' || m === '@nuxt/devtools-edge')) {
        options._modules.push('@nuxt/devtools')
      }
    }
  }

  if (!options._modules.some(m => m === '@nuxt/scripts' || m === '@nuxt/scripts-nightly')) {
    options.imports = defu(options.imports, {
      presets: [scriptsStubsPreset],
    })
  }

  // Nuxt Webpack Builder is currently opt-in
  if (options.builder === '@nuxt/webpack-builder') {
    if (!await import('./features').then(r => r.ensurePackageInstalled('@nuxt/webpack-builder', {
      rootDir: options.rootDir,
      searchPaths: options.modulesDir,
    }))) {
      logger.warn('Failed to install `@nuxt/webpack-builder`, please install it manually, or change the `builder` option to vite in `nuxt.config`')
    }
  }

  // Add core modules
  options._modules.push(pagesModule, metaModule, componentsModule)
  options._modules.push([importsModule, {
    transform: {
      include: options._layers
        .filter(i => i.cwd && i.cwd.includes('node_modules'))
        .map(i => new RegExp(`(^|\/)${escapeRE(i.cwd!.split('node_modules/').pop()!)}(\/|$)(?!node_modules\/)`)),
    },
  }])
  options._modules.push(schemaModule)
  options.modulesDir.push(resolve(options.workspaceDir, 'node_modules'))
  options.modulesDir.push(resolve(pkgDir, 'node_modules'))
  options.build.transpile.push(
    'mocked-exports',
    'std-env', // we need to statically replace process.env when used in runtime code
  )
  options.alias['vue-demi'] = resolve(options.appDir, 'compat/vue-demi')
  options.alias['@vue/composition-api'] = resolve(options.appDir, 'compat/capi')
  if (options.telemetry !== false && !process.env.NUXT_TELEMETRY_DISABLED) {
    options._modules.push('@nuxt/telemetry')
  }

  // warn if user is using reserved namespaces
  const allowedKeys = new Set(['baseURL', 'buildAssetsDir', 'cdnURL', 'buildId'])
  for (const key in options.runtimeConfig.app) {
    if (!allowedKeys.has(key)) {
      logger.warn(`The \`app\` namespace is reserved for Nuxt and is exposed to the browser. Please move \`runtimeConfig.app.${key}\` to a different namespace.`)
      delete options.runtimeConfig.app[key]
    }
  }

  // Ensure we share key config between Nuxt and Nitro
  createPortalProperties(options.nitro.runtimeConfig, options, ['nitro.runtimeConfig', 'runtimeConfig'])
  createPortalProperties(options.nitro.routeRules, options, ['nitro.routeRules', 'routeRules'])

  // prevent replacement of options.nitro
  const nitroOptions = options.nitro
  Object.defineProperties(options, {
    nitro: {
      configurable: false,
      enumerable: true,
      get: () => nitroOptions,
      set (value) {
        Object.assign(nitroOptions, value)
      },
    },
  })

  const nuxt = createNuxt(options)

  nuxt.runWithContext(() => {
    // We register hooks layer-by-layer so any overrides need to be registered separately
    if (opts.overrides?.hooks) {
      nuxt.hooks.addHooks(opts.overrides.hooks)
    }

    if (
      nuxt.options.debug
      && nuxt.options.debug.hooks
      && (nuxt.options.debug.hooks === true || nuxt.options.debug.hooks.server)
    ) {
      createDebugger(nuxt.hooks, { tag: 'nuxt' })
    }
  })

  if (opts.ready !== false) {
    await nuxt.ready()
  }

  return nuxt
}
```

---

**Code reference:** `packages/nuxt/src/core/builder.ts`

```ts
export async function build (nuxt: Nuxt) {
  const app = createApp(nuxt)
  nuxt.apps.default = app

  const generateApp = debounce(() => _generateApp(nuxt, app), undefined, { leading: true })
  await generateApp()

  if (nuxt.options.dev) {
    watch(nuxt)
    nuxt.hook('builder:watch', async (event, relativePath) => {
      // Unset mainComponent and errorComponent if app or error component is changed
      if (event === 'add' || event === 'unlink') {
        const path = resolve(nuxt.options.srcDir, relativePath)
        for (const layer of nuxt.options._layers) {
          const relativePath = relative(layer.config.srcDir || layer.cwd, path)
          if (relativePath.match(/^app\./i)) {
            app.mainComponent = undefined
            break
          }
          if (relativePath.match(/^error\./i)) {
            app.errorComponent = undefined
            break
          }
        }
      }

      // Recompile app templates
      await generateApp()
    })
    nuxt.hook('builder:generateApp', (options) => {
      // Bypass debounce if we are selectively invalidating templates
      if (options) { return _generateApp(nuxt, app, options) }
      return generateApp()
    })
  }

  if (!nuxt.options._prepare && !nuxt.options.dev && nuxt.options.experimental.buildCache) {
    const { restoreCache, collectCache } = await getVueHash(nuxt)
    if (await restoreCache()) {
      await nuxt.callHook('build:done')
      return await nuxt.callHook('close', nuxt)
    }
    nuxt.hooks.hookOnce('nitro:build:before', () => collectCache())
    nuxt.hooks.hookOnce('close', () => cleanupCaches(nuxt))
  }

  await nuxt.callHook('build:before')
  if (nuxt.options._prepare) {
    nuxt.hook('prepare:types', () => nuxt.close())
    return
  }

  if (nuxt.options.dev && !nuxt.options.test) {
    nuxt.hooks.hookOnce('build:done', () => {
      checkForExternalConfigurationFiles()
        .catch(e => logger.warn('Problem checking for external configuration files.', e))
    })
  }

  await bundle(nuxt)

  await nuxt.callHook('build:done')

  if (!nuxt.options.dev) {
    await nuxt.callHook('close', nuxt)
  }
}
```
