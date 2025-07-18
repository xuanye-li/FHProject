import { reactive } from 'vue'

export interface NuxtApp {
  payload: Record<string, any>
  ssrContext?: Record<string, any>
  _asyncDataPromises: Map<string, Promise<any>>
  _payloadCache?: Record<string, any>
  _pendingAsyncData?: Set<string>
}

const nuxtApp: NuxtApp = reactive({
  payload: {},
  _asyncDataPromises: new Map(),
  _payloadCache: {},
  _pendingAsyncData: new Set(),
})

export function useNuxtApp(): NuxtApp {
  return nuxtApp
}

export function onNuxtReady(cb: () => void) {
  cb()
}

export const clientOnlySymbol = Symbol('client-only')

export function useRuntimeConfig() {
  return {}
}

export const asyncDataDefaults = {}
export const granularCachedData = false
export const pendingWhenIdle = false
export const purgeCachedData = () => {}

console.log('[nuxt-shim] minimal runtime active')
