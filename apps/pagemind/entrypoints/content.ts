import { onMessage, sendMessage } from '@/utils/messaging.ts';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { Readability } from '@mozilla/readability'
import TurndownService from 'turndown';

const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });
turndownService.use(gfm);

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    console.log('PageMind content script loaded')
  },
})


onMessage('extractContentRequest', () => {
  setTimeout(() => {
    const docClone = document.cloneNode(true) as Document;
    const reader = new Readability(docClone);
    const article = reader.parse();

    if (article) {
      const markdown = turndownService.turndown(article.content);
      sendMessage('contentExtracted', {
        title: article.title || document.title,
        url: location.href,
        content: markdown || '',
      });
    } else {
      console.warn("readability failure");
      sendMessage('contentExtracted', {
        title: document.title,
        url: location.href,
        content: document.body.innerText || '',
      });
    }
  }, 1000);

  return true;
});

// old filters before readability integration

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
