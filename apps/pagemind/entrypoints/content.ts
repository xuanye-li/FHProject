import { Readability } from '@mozilla/readability'
import { browser } from 'wxt/browser'

function extractWikipedia(): string {
  const paragraphs = Array.from(
    document.querySelectorAll('#mw-content-text .mw-parser-output > p')
  )
    .map(p => p.innerText.trim())
    .filter(text => text.length > 0)

  return paragraphs.join('\n\n')
}
function extractMedium(): string {
  const article = document.querySelector('article')
  if (!article) return ''

  const textBlocks = Array.from(article.querySelectorAll('p, h1, h2, h3'))
    .map(el => el.textContent?.trim() || '')
    .filter(text => text.length > 40 && !/©|Subscribe|Sign up|Read more/i.test(text))

  return textBlocks.join('\n\n')
}

function extractContent(): string {
  const extractors: Record<string, () => string> = {
    'wikipedia.org': extractWikipedia,
    'medium.com': extractMedium,
  }

  for (const domain in extractors) {
    if (location.hostname.includes(domain)) {
      return extractors[domain]()
    }
  }

  return document.body.innerText
}


// export default defineContentScript({
//   matches: ['*://*.wikipedia.org/*', '*://medium.com/*', '*://*.medium.com/*'],
//   runAt: 'document_idle',
//   main() {
//     console.log('Hello content.')
//   },
// })

// browser.runtime.onMessage.addListener((msg, _, sendResponse) => {
//   console.log('📩 Received message in content script:', msg)
//   if (msg.type === 'extract_content') {
//     console.log('📩 Extract', msg)
//     const clean = extractContent()

//     browser.runtime.sendMessage({
//       type: 'content_extracted',
//       data: {
//         title: document.title,
//         url: location.href,
//         content: clean.slice(0, 2000),
//       },
//     })

//     sendResponse({ ok: true })
//   }

//   return true
// })

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    console.log('PageMind content script loaded')
  },
})

browser.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.type === 'extract_content') {
    const docClone = document.cloneNode(true) as Document
    const reader = new Readability(docClone)
    const article = reader.parse()

    if (article) {
      browser.runtime.sendMessage({
        type: 'content_extracted',
        data: {
          title: article.title || document.title,
          url: location.href,
          content: article.textContent,
        },
      })
    }

    sendResponse({ ok: true })
  }

  return true
})
