import { resolve } from 'path'
import uiPro from '@nuxt/ui-pro/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt';
import FileRouterPlugin from '../unplugin-simple-router/src/index'
import NuxtShimPlugin from './plugins/nuxt-plugin'


export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [tailwindcss(), uiPro(), FileRouterPlugin({ pagesDir: 'pages' }), NuxtShimPlugin()],
    optimizeDeps: {
      exclude: [
        'nuxt',
        'nuxt/app'
      ]
    },
resolve: {
  alias: {
    'nuxt/app': '/plugins/nuxt-runtime-shim.ts',
    '#app': '/plugins/nuxt-runtime-shim.ts',

    'nuxt/dist/app/nuxt.js':
      '/home/xuan/Hacker/FHProject/node_modules/nuxt/dist/app/nuxt.js',

    'nuxt/dist/app/composables/asyncData.js':
      '/home/xuan/Hacker/FHProject/node_modules/nuxt/dist/app/composables/asyncData.js',

    '#build/nuxt.config.mjs': resolve(__dirname, 'plugins/nuxt-build-shim.ts'),
    '#internal/nuxt/paths': resolve(__dirname, 'plugins/nuxt-build-shim.ts'),
    '#build/router.options': resolve(__dirname, 'plugins/nuxt-build-shim.ts'),
    '#build/pages': resolve(__dirname, 'plugins/nuxt-build-shim.ts'),
    '#app-manifest': resolve(__dirname, 'plugins/nuxt-build-shim.ts'),
  }
},
  }),
  manifest: {
    name: 'Pagemind',
    description: 'testing',
    version: '1.0.0',
    permissions: ['tabs', 'sidePanel'],
    host_permissions: ['<all_urls>'],
    side_panel: {
      default_path: 'entrypoints/sidepanel/index.html',
    },
    background: {
      service_worker: 'entrypoints/background.ts',
    },
  },
});
