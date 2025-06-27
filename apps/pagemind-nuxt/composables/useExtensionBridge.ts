/**
 * Composable for communicating between Nuxt app and WXT extension
 */
export const useExtensionBridge = () => {
  const isInExtension = computed(() => {
    return window.parent !== window && window.top !== window
  })

  /**
   * Send message to WXT extension
   */
  const sendToExtension = (type: string, payload: any = {}) => {
    if (!isInExtension.value) {
      console.warn('Not running inside extension iframe')
      return
    }

    window.parent.postMessage({
      type,
      payload,
      source: 'nuxt'
    }, '*')
  }

  /**
   * Listen for messages from WXT extension
   */
  const onExtensionMessage = (callback: (data: any) => void) => {
    const handler = (event: MessageEvent) => {
      if (event.data.source === 'wxt') {
        callback(event.data)
      }
    }

    window.addEventListener('message', handler)

    // Return cleanup function
    return () => window.removeEventListener('message', handler)
  }

  /**
   * Extension storage operations
   */
  const extensionStorage = {
    async setItem(key: string, value: any) {
      return new Promise<void>((resolve) => {
        const cleanup = onExtensionMessage((data) => {
          if (data.type === 'STORAGE_SET_RESPONSE' && data.payload.key === key) {
            cleanup()
            resolve()
          }
        })

        sendToExtension('STORAGE_SET', { key, value })
      })
    },

    async getItem(key: string) {
      return new Promise<any>((resolve) => {
        const cleanup = onExtensionMessage((data) => {
          if (data.type === 'STORAGE_GET_RESPONSE' && data.payload.key === key) {
            cleanup()
            resolve(data.payload.value)
          }
        })

        sendToExtension('STORAGE_GET', { key })
      })
    }
  }

  return {
    isInExtension,
    sendToExtension,
    onExtensionMessage,
    extensionStorage
  }
}
