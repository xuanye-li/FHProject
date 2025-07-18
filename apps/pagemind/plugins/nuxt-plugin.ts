import path from 'path'
import { createUnplugin } from 'unplugin'

export const NuxtShimPlugin = createUnplugin(() => {
  const runtimeShim = path.resolve(__dirname, 'nuxt-shim.ts')
  const buildShim = path.resolve(__dirname, 'nuxt-build-shim.ts')

  return {
    name: 'unplugin-nuxt-shim',

    enforce: 'pre',

    resolveId(id) {
      if (id === 'nuxt/app' || id === '#app' || id === '#imports') {
        return runtimeShim
      }
      if (
        id.startsWith('#build/') ||
        id.startsWith('#internal/') ||
        id === '#app-manifest'
      ) {
        return buildShim
      }

      return null
    },
  }
})

export const vite = NuxtShimPlugin.vite
export default vite
