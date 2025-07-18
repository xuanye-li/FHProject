import fg from 'fast-glob'
import { createUnplugin } from 'unplugin'

export interface Options {
  pagesDir?: string
}

export const FileRouterPlugin = createUnplugin<Options | undefined>((options) => {
  const pagesDir = options?.pagesDir || 'pages'

  function generateRoutes() {
    const files = fg.sync('**/*.vue', { cwd: pagesDir })
    return files.map(file => {
      const routePath =
        '/' + file.replace(/\.vue$/, '').replace(/index$/, '').replace(/\\/g, '/')
      return {
        path: routePath === '' ? '/' : routePath,
        component: `() => import('/${pagesDir}/${file}')`
      }
    })
  }

  return {
    name: 'unplugin-simple-router',

    resolveId(id) {
      if (id === 'virtual:routes') return '\0virtual:routes'
    },

    load(id) {
      if (id === '\0virtual:routes') {
        const files = fg.sync('**/*.vue', { cwd: pagesDir })
        const routes = files.map(file => {
          const routePath = '/' + file.replace(/\.vue$/, '').replace(/index$/, '').replace(/\\/g, '/')
          return `{ path: '${routePath === '' ? '/' : routePath}', component: () => import('/${pagesDir}/${file}') }`
        })

        return `export default [${routes.join(',\n')}]`
      }
    },


    configureServer(server) {
      server.watcher.add(pagesDir)
      server.watcher.on('add', () => {
        const mod = server.moduleGraph.getModuleById('\0virtual:routes')
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
      server.watcher.on('unlink', () => {
        const mod = server.moduleGraph.getModuleById('\0virtual:routes')
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
})

export default FileRouterPlugin.vite
export const rollup = FileRouterPlugin.rollup
export const webpack = FileRouterPlugin.webpack
export const rspack = FileRouterPlugin.rspack
export const esbuild = FileRouterPlugin.esbuild
