import uiPro from '@nuxt/ui-pro/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt';
import FileRouterPlugin from '../unplugin-simple-router/src/index'
import NuxtShimPlugin from './plugins/nuxt-plugin'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [tailwindcss(), uiPro(), FileRouterPlugin({ pagesDir: 'pages' }), NuxtShimPlugin()],
    optimizeDeps: {
      exclude: [
        'nuxt',
        'nuxt/app'
      ]
    }
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
