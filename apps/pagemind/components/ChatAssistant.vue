<script setup lang="ts">
import { useLlmStore } from '@/stores/llmStore'
import { onMessage, sendMessage } from '@/utils/messaging.ts';
import { onMounted, ref } from 'vue'
import { browser } from 'wxt/browser'

interface ExtractedContent {
  title: string
  url: string
  content: string
}

const content = ref<ExtractedContent | null>(null)
const context = ref('')
const showContext = ref(false)

const isChatting = ref(false)
const isSending = ref(false)
const chatHistory = ref<{ role: 'user' | 'assistant', content: string }[]>([])
const userInput = ref<string>('')

const llm = useLlmStore()

const startChat = async () => {
  isChatting.value = true
  chatHistory.value = []
  chatHistory.value.push({ role: 'assistant', content: "Hi! Ask me anything about this page." })
}

const sendChat = async () => {
  if (!userInput.value || !content.value || llm.selectedModel.isPaid) return
  isSending.value = true

  const endpoint = llm.selectedModel.endpoint
  const modelId = llm.selectedModel.id

  // For Groq, get the API key from env (dev only)
  let apiKey = ''
  if (llm.selectedModel.apiType === 'groq') {
    apiKey = import.meta.env.VITE_GROQ_API_KEY
  }
  console.log('Loaded API key:', apiKey)

  const trimmedContent = content.value.content.slice(0, 2000)

  const messages = [
    {
      role: 'system',
      content: `You are an assistant that answers questions using the following page content as context.\n${trimmedContent}`,
    },
    ...chatHistory.value,
    { role: 'user', content: userInput.value }
  ]

  try {
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
  } catch (e) {
    chatHistory.value.push({ role: 'assistant', content: 'Error processing your message.' })
    console.error(e)
  } finally {
    isSending.value = false
  }
}

onMounted(() => {
  onMessage('contentExtracted', ({ data }) => {
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

</script>

<template>
  <div v-if="content">
    <h2 class="text-lg font-bold truncate text-primary">
      {{ content.title }}
    </h2>
    <p class="text-xs text-muted break-all">{{ content.url }}</p>
    <div class="flex items-center gap-2 mb-2">
      <UFormField label="Model" class="mb-2">
        <USelect
          v-model="llm.selectedModelId"
          :items="llm.models.map(m => ({ label: m.label, value: m.id }))"
        />
      </UFormField>

      <UButton
        :label="showContext ? 'Hide Chat Context' : 'Show Chat Context'"
        @click="showContext = !showContext"
        size="sm"
        variant="ghost"
        class="mb-2"
      />
    </div>

    <div
      v-if="showContext"
      class="text-xs whitespace-pre-line bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 max-h-40 overflow-y-auto"
    >
      {{ content.content }}
    </div>

    <div v-if="!isChatting" class="mt-4">
      <UButton label="Start Chat About This Page" @click="startChat" block color="primary" />
    </div>

    <div v-if="isChatting" class="border-t pt-4 mt-4">
      <div v-if="llm.selectedModel.isPaid" class="mb-4 text-red-500">
        This model requires a paid API key. Not supported yet.
      </div>

      <div class="mb-2 max-h-135 overflow-y-auto space-y-2">
        <div v-for="(msg, i) in chatHistory" :key="i" :class="msg.role === 'user' ? 'text-right' : 'text-left'">
          <span :class="msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-default'"
                class="inline-block rounded px-2 py-1 max-w-[80%]">
            {{ msg.content }}
          </span>
        </div>
      </div>
      <form @submit.prevent="sendChat" class="flex gap-2">
        <UInput v-model="userInput" :disabled="isSending" placeholder="Ask about this page..." class="flex-1" />
        <UButton type="submit" :loading="isSending" label="Send" color="primary" />
      </form>
    </div>
  </div>

  <div v-else class="text-muted italic text-sm px-4 py-2">
    Loading content…
  </div>
</template>
