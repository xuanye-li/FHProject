import { browser } from 'wxt/browser'

export default defineBackground(() => {
  browser.sidePanel?.setPanelBehavior({ openPanelOnActionClick: true })

  browser.tabs.onActivated.addListener(({ tabId }) => {
    browser.tabs.get(tabId).then(tab => {
      if (tab?.title) {
        browser.runtime.sendMessage({ type: 'TAB_TITLE', title: tab.title })
      }
    })
  })

  browser.tabs.onUpdated.addListener((tabId, _, tab) => {
    if (tab.active && tab.title) {
      browser.runtime.sendMessage({ type: 'TAB_TITLE', title: tab.title })
    }
  })
})
