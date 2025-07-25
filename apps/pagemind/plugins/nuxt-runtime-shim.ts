console.log('[nuxt-runtime-shim]')

const fakeNuxtApp = {
  payload: { data: {}, _errors: {}, serverRendered: false },
  static: { data: {} },
  _asyncData: {},
  _asyncDataPromises: {},
  hooks: { hook: () => {}, callHook: async () => {} },
  vueApp: null,
  ssrContext: null,
  isHydrating: false
}

if (typeof globalThis !== 'undefined') {
  ;(globalThis as any).__NUXT_ASYNC_CONTEXT__ = fakeNuxtApp
  console.log('[nuxt-runtime-shim]')
}

import * as unctx from 'unctx'
try {
  const origGetContext = unctx.getContext
  ;(unctx as any).getContext = (id: string, opts: any) => {
    if (id?.includes('nuxt')) {
      console.log('[nuxt-runtime-shim]')
      return {
        use: () => fakeNuxtApp,
        set: () => {},
        clear: () => {}
      }
    }
    return origGetContext(id, opts)
  }
} catch (err) {
  console.warn('[nuxt-runtime-shim] Failedx', err)
}

import * as nuxtAppRuntime from 'nuxt/dist/app/nuxt.js'

try {
  Object.defineProperty(nuxtAppRuntime, 'getNuxtAppCtx', {
    value: () => fakeNuxtApp
  })
  Object.defineProperty(nuxtAppRuntime, 'useNuxtApp', {
    value: () => fakeNuxtApp
  })
  console.log('[nuxt-runtime-shim] Patched')
} catch (err) {
  console.warn('[nuxt-runtime-shim] Failed', err)
}

export * from 'nuxt/dist/app/composables/asyncData.js'
