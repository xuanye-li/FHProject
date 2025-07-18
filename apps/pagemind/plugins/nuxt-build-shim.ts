// Stubs for all Nuxt virtual build imports

export const appId = 'shim-app'
export const multiApp = false
export const chunkErrorEvent = false
export const renderJsonPayloads = false
export const appManifest = false
export const payloadExtraction = false
export const hashMode = true

export const nuxtLinkDefaults = {}
export const routerOptions = {}

export function buildAssetsURL(path: string) {
  return path
}

export const START_LOCATION = { path: '/' }

export const asyncDataDefaults = {}
export const granularCachedData = false
export const pendingWhenIdle = false
export const purgeCachedData = () => {}

export const fetchDefaults = {}
export const cookieStore = {}

const __appConfig = {}
export default __appConfig

console.log('[nuxt-build-shim] virtual module stubs active')
