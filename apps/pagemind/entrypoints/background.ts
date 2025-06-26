import { sendMessage } from '@/utils/messaging.ts';
import { browser } from 'wxt/browser'

export default defineBackground(() => {
  browser.sidePanel?.setPanelBehavior({ openPanelOnActionClick: true })

  browser.tabs.onActivated.addListener(({ tabId }) => {
    sendMessage('extractContentRequest', undefined, { tabId })
      .catch((error) => {
        console.warn(`${tabId} fail`, error);
      });
  })

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      sendMessage('extractContentRequest', undefined, { tabId })
        .catch((error) => {
          console.warn(`${tabId} fail`, error);
        });
    }
  })
})
