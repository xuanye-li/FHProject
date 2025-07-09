<script setup lang="ts">
import { useKnowledgeCardsStore } from '@/stores/knowledgeCards';
import { useLlmStore } from '@/stores/llm'
import { onMessage, sendMessage } from '@/utils/messaging.ts';
import { nanoid } from 'nanoid'
import { onMounted, onUnmounted, ref } from 'vue'
import { browser } from 'wxt/browser'

interface ExtractedContent {
  title: string
  url: string
  content: string
}

const content = ref<ExtractedContent | null>(null)
const context = ref('')
let disposeContentExtracted: (() => void) | undefined

const showContext = ref(false)
const isChatting = ref(false)
const status = ref<'ready' | 'submitted' | 'streaming' | 'error'>('ready')
const chatHistory = ref<{ role: 'user' | 'assistant', content: string }[]>([])
const userInput = ref<string>('')

const llm = useLlmStore()

const summarizedChat = ref('')
const isSummarizing = ref(false)

const cardsStore = useKnowledgeCardsStore()

const startChat = async () => {
  isChatting.value = true
  chatHistory.value = []
  chatHistory.value.push({ role: 'assistant', content: "Hi! Ask me anything about this page." })
}

const sendChat = async () => {
  if (!userInput.value || !content.value || llm.selectedModel.isPaid) return
  status.value = 'submitted'

  const endpoint = llm.selectedModel.endpoint
  const modelId = llm.selectedModel.id

  let apiKey = ''
  if (llm.selectedModel.apiType === 'groq') {
    apiKey = import.meta.env.VITE_GROQ_API_KEY
  }
  console.log('Loaded API key:', apiKey)

  const trimmedContent = content.value.content.slice(0, 6000) // token limit

  const messages = [
    {
      role: 'system',
      content: `You are an assistant that answers questions using the following page content as context.\n${trimmedContent}`,
    },
    ...chatHistory.value,
    { role: 'user', content: userInput.value }
  ]

  try {
    status.value = 'streaming'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature: 0.5,
      }),
    })

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || 'No response.'
    chatHistory.value.push({ role: 'user', content: userInput.value })
    chatHistory.value.push({ role: 'assistant', content: reply })
    userInput.value = ''
    status.value = 'ready'
  } catch (e) {
    chatHistory.value.push({ role: 'assistant', content: 'Error processing your message.' })
    console.error(e)
    status.value = 'error'
  }
}

onMounted(() => {
  disposeContentExtracted = onMessage('contentExtracted', ({ data }) => {
    content.value = data;
    isChatting.value = false;
    chatHistory.value = [];
    userInput.value = '';
    showContext.value = false;
  });

  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab?.id) {
      sendMessage('extractContentRequest', undefined, { tabId: tab.id })
        .catch((error) => {
          console.error(`${tab.id}:`, error);
          content.value = null;
          context.value = 'could not load content from the active tab';
        });
    } else {
      content.value = null;
      context.value = 'no active tab';
    }
  });
})

onUnmounted(() => {
  if (disposeContentExtracted) disposeContentExtracted()
})

const summarizeChat = async () => {
  if (!content.value) return
  isSummarizing.value = true
  summarizedChat.value = ''

  const formattedChat = chatHistory.value
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const prompt = `
    Given the following conversation between a user and an assistant about this page:
    ---
    ${formattedChat}
    ---
    Summarize the most important information in **5 concise bullet points** about the conversation`

  try {
    const res = await fetch(llm.selectedModel.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: llm.selectedModel.id,
        messages: [
          { role: 'system', content: "You are an assistant that summarizes conversations into 5 bullet points." },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    })
    const data = await res.json()
    summarizedChat.value = data.choices?.[0]?.message?.content || 'No summary returned.'
  } catch (e) {
    summarizedChat.value = 'Error summarizing conversation.'
    console.error(e)
  } finally {
    isSummarizing.value = false
  }
}

function saveSummaryCard() {
  if (!summarizedChat.value || !content.value) return
  cardsStore.addCard({
    id: nanoid(),
    title: content.value.title,
    highlights: summarizedChat.value.split('\n').map(line => line.trim())
    .filter((line, idx) =>
      line.length > 0 &&
      (!/^here are.*bullet/i.test(line) && !(idx === 0 && !line.startsWith('-') && !line.startsWith('*')))
    ),
    tags: [],
    sourceUrl: content.value.url,
    timestamp: new Date().toISOString(),
    model: llm.selectedModel?.label ?? '',
  })
  summarizedChat.value = ''
}

</script>

<template>
  <div class="h-full flex flex-col max-w-md mx-auto bg-background p-0">
    <div class="px-4 pt-4 pb-2 border-b shrink-0">
      <h2 class="text-lg font-bold truncate text-primary">
        {{ content?.title || 'Loading…' }}
      </h2>
      <p v-if="content" class="text-xs text-muted break-all mb-2">{{ content.url }}</p>
      <div class="flex items-center gap-2 mb-2">
        <UButton
          v-if="content"
          :label="showContext ? 'Hide Context' : 'Show Context'"
          @click="showContext = !showContext"
          icon="i-heroicons-eye"
          size="sm"
          variant="soft"
        />
      </div>
      <div
        v-if="showContext && content"
        class="text-xs mt-2 bg-gray-100 dark:bg-gray-800 rounded p-2 max-h-28 overflow-y-auto"
      >
        {{ content.content }}
      </div>
    </div>

    <div class="flex-1 min-h-0 flex flex-col px-2 py-2">
      <div v-if="!content" class="flex-1 flex items-center justify-center text-muted italic text-sm">
        Loading content…
      </div>

      <div v-else-if="content && !isChatting" class="flex justify-center mt-4">
        <UButton
          label="Start Chat About This Page"
          @click="startChat"
          color="primary"
          class="w-full max-w-xs"
        />
      </div>

      <div v-else-if="content && isChatting" class="flex-1 min-h-0 flex flex-col rounded-xl bg-background/60 shadow-sm p-2">
        <UChatMessages
          :messages="chatHistory"
          :status="status"
          :user="{ side: 'right', variant: 'subtle', avatar: { icon: 'i-lucide-user' } }"
          :assistant="{ side: 'left', variant: 'subtle', avatar: { icon: 'i-lucide-bot' }}"
          :compact="true"
          class="flex-1 min-h-0 overflow-y-auto"
        />
      </div>

      <div v-if="isChatting && isSummarizing" class="flex justify-end mt-2">
        <UButton
          loading
          disabled
          label="Summarizing..."
          size="sm"
        />
      </div>
    </div>

    <div v-if="isChatting" class="px-4 py-2 border-t bg-background shrink-0">
      <UChatPrompt v-model="userInput" @submit="sendChat">
        <UChatPromptSubmit :status="status" />
      </UChatPrompt>

      <div class="flex gap-2 mt-2 items-center">
        <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5" />
        <USelectMenu
          v-model="llm.selectedModelId"
          :items="llm.models.map(m => ({ label: m.label, value: m.id }))"
          variant="ghost"
          class="min-w-[140px]"
          placeholder="Select model"
        />
        <UButton
          label="Summarize This Chat"
          color="primary"
          size="sm"
          @click="summarizeChat"
          :disabled="chatHistory.length <= 1 || isSummarizing"
          :loading="isSummarizing"
          class="ml-2"
        />
      </div>
    </div>

    <UCard
      v-if="summarizedChat"
      class="mx-4 mb-2 px-4 py-3 bg-secondary/70 dark:bg-secondary-900/70 rounded-xl whitespace-pre-line shrink-0"
      :ui="{ body: 'p-0' }"
    >
      <div class="flex justify-end">
        <UButton
          icon="i-heroicons-x-mark"
          size="sm"
          color="gray"
          variant="ghost"
          @click="summarizedChat = ''"
          aria-label="Close"
        />
      </div>
      <p class="text-sm">{{ summarizedChat }}</p>
      <UButton
        class="mt-3"
        label="Save as Knowledge Card"
        color="primary"
        @click="saveSummaryCard"
        block
      />
    </UCard>
  </div>
</template>
