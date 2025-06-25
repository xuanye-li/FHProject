<script setup lang="ts">
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

const summarizeWithGroq = async () => {
  if (!content.value) return
  const api_key = "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"

  console.log('Loaded API key:', api_key)

  isSummarizing.value = true
  summary.value = ''

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
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
                }.\n\n${content.value.content}`,
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
  browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'content_extracted') {
      content.value = msg.data
    }
  })

  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab?.id) {
      browser.tabs.sendMessage(tab.id, { type: 'extract_content' }).catch(() => {})
    }
  })
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
        <USelect
          v-model="summaryStyle"
          :options="summaryOptions"
          value-attribute="value"
        />
      </UFormGroup>

      <UFormGroup label="Number of items" name="count">
        <UInput v-model.number="numItems" type="number" min="1" max="20" />
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
