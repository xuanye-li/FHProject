import { browser } from 'wxt/browser'

export default defineBackground(() => {
  browser.sidePanel?.setPanelBehavior({ openPanelOnActionClick: true })

  browser.tabs.onActivated.addListener(({ tabId }) => {
    browser.tabs.sendMessage(tabId, { type: 'extract_content' }).catch(() => {
    })
  })

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      browser.tabs.sendMessage(tabId, { type: 'extract_content' }).catch(() => {})
    }
  })
})
