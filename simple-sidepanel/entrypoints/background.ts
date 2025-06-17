import { browser } from 'wxt/browser'

export default defineBackground(() => {
  if (browser.sidePanel?.setPanelBehavior) {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  }

  browser.tabs.onUpdated.addListener((tabId, _, tab) => {
    if (tab.url) {
      browser.sidePanel?.setOptions({
        tabId,
        enabled: true,
        path: 'entrypoints/sidepanel/index.html',
      })
    }
  })
})