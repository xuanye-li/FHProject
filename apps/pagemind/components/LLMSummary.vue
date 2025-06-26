<script setup lang="ts">
import { onMessage, sendMessage } from '@/utils/messaging.ts';
import { onMounted, ref } from 'vue'
import { browser } from 'wxt/browser'

interface ExtractedContent {
  title: string
  url: string
  content: string
}

const content = ref<ExtractedContent | null>(null)
const summary = ref('')
const isSummarizing = ref(false)

const summaryStyle = ref<string>('bullet')
const summaryOptions = [
  { label: 'Bullet Points', value: 'bullet' },
  { label: 'Paragraphs', value: 'paragraphs' },
]
const numItems = ref(5)
const model_type = ref<string>('llama3-8b-8192')

const summarizeWithGroq = async () => {
  if (!content.value) return
  const api_key = "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"

  console.log('Loaded API key:', api_key)

  isSummarizing.value = true
  summary.value = ''

  const trimmedContent = content.value.content.slice(0, 4000)

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model_type.value,
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that summarizes webpages clearly and concisely.',
          },
          {
            role: 'user',
            content: `
                Summarize the following content from this page using ${summaryStyle.value} format.
                Only include the ${numItems.value} most important ${
                  summaryStyle.value === 'bullet' ? 'bullet points' : 'paragraphs'
                }.\n\n${trimmedContent}`,
          },
        ],
        temperature: 0.5,
      }),
    })

    const data = await res.json()
    console.log('Groq raw response:', JSON.stringify(data, null, 2))
    summary.value = data.choices?.[0]?.message?.content || 'No summary returned.'
  } catch (e) {
    summary.value = 'Error generating summary.'
    console.error(e)
  } finally {
    isSummarizing.value = false
  }
}


onMounted(() => {
  onMessage('contentExtracted', ({ data }) => {
    content.value = data;;
  });

  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab?.id) {
      sendMessage('extractContentRequest', undefined, { tabId: tab.id })
        .catch((error) => {
          console.error(`${tab.id}:`, error);
          content.value = null;
          summary.value = 'could not load content from the active tab';
        });
    } else {
      content.value = null;
      summary.value = 'no active tab';
    }
  });
})

</script>

<template>
  <UCard v-if="content">
    <template #header>
      <h2 class="text-lg font-bold truncate text-primary">
        {{ content.title }}
      </h2>
      <p class="text-xs text-muted break-all">{{ content.url }}</p>
    </template>

    <div class="text-sm whitespace-pre-line text-default max-h-[180px] overflow-y-auto">
      {{ content.content }}
    </div>

    <div class="mt-4 space-y-2">
      <UFormGroup label="Summary Style" name="style">
        <USelect v-model="summaryStyle" :items="summaryOptions" />
      </UFormGroup>

      <UFormGroup label="Number of items" name="count">
        <UInput v-model="numItems" type="number" min="1" max="20" />
      </UFormGroup>
      <UButton
        label="Summarize with Groq"
        :loading="isSummarizing"
        @click="summarizeWithGroq"
        block
        color="primary"
      />

      <div v-if="summary" class="text-sm whitespace-pre-line bg-gray-100 dark:bg-gray-800 p-2 rounded">
        {{ summary }}
      </div>
    </div>
  </UCard>

  <div v-else class="text-muted italic text-sm px-4 py-2">
    Loading content…
  </div>
</template>
