import { browser } from 'wxt/browser'

export default defineBackground(() => {
  if (browser.sidePanel?.setPanelBehavior) {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  }

  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId)
    if (tab?.url) {
      await browser.sidePanel?.setOptions({
        tabId,
        enabled: true,
        path: 'entrypoints/sidepanel/index.html',
      })
    }
  })

    browser.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => {
        if (tab?.url) {
            browser.sidePanel.setOptions({
            tabId,
            enabled: true,
            path: 'entrypoints/sidepanel/index.html',
            })
        }
    })
})