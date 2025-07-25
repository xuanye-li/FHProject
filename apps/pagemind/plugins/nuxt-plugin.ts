import path from 'path'
import { createUnplugin } from 'unplugin'

export const NuxtShimPlugin = createUnplugin(() => {
  const buildShim = path.resolve(__dirname, 'nuxt-build-shim.ts')

  return {
    name: 'unplugin-nuxt-shim',
    resolveId(id) {
      if (
        id.startsWith('#build/') ||
        id.startsWith('#internal/nuxt/') ||
        id === '#app-manifest' ||
        id === '#build/pages' ||
        id === '#build/router.options' ||
        id === '#build/nuxt.config.mjs' ||
        id === '#build/app.config.mjs'
      ) {
        return buildShim
      }
    }
  }
})

export const vite = NuxtShimPlugin.vite
export default vite
