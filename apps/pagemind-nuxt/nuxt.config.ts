export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/',           // Change from './' to '/'
    buildAssetsDir: '/_nuxt/'
  },
  nitro: { preset: 'static' }     // Output is fully static SPA
})
