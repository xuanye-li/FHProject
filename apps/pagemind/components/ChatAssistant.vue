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
const context = ref('')
const model_type = ref<string>('llama3-8b-8192')
const showContext = ref(false)

const isChatting = ref(false)
const isSending = ref(false)
const chatHistory = ref<{ role: 'user' | 'assistant', content: string }[]>([])
const userInput = ref<string>('')

const startChat = async () => {
  isChatting.value = true
  chatHistory.value = []
  chatHistory.value.push({ role: 'assistant', content: "Hi! Ask me anything about this page." })
}

const sendChat = async () => {
  if (!userInput.value || !content.value) return
  isSending.value = true

  const api_key = "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"

  console.log('Loaded API key:', api_key)

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
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model_type.value,
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
    <template #header>
      <h2 class="text-lg font-bold truncate text-primary">
        {{ content.title }}
      </h2>
      <p class="text-xs text-muted break-all">{{ content.url }}</p>
    </template>


    <UButton
      :label="showContext ? 'Hide Chat Context' : 'Show Chat Context'"
      @click="showContext = !showContext"
      size="sm"
      variant="ghost"
      class="mb-2"
    />
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
      <div class="mb-2 max-h-40 overflow-y-auto space-y-2">
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
