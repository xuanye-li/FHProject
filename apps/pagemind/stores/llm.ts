import { defineStore } from 'pinia'

export const useLlmStore = defineStore('llm', {
  state: () => ({
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        label: 'Groq Llama 3 Versatile',
        apiType: 'groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        isPaid: false,
      },
      {
        id: 'meta-llama/llama-4-scout-17b-16e-instruct',
        label: 'Groq Llama 4 Scout',
        apiType: 'groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        isPaid: false,
      },
      {
        id: 'gemma2-9b-it',
        label: 'Groq Gemma 2',
        apiType: 'groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        isPaid: false,
      },
      {
        id: 'gpt-4o',
        label: 'OpenAI GPT-4o',
        apiType: 'openai',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        isPaid: true,
        keyEnv: 'VITE_OPENAI_API_KEY',
      },
      {
        id: 'claude-3-opus',
        label: 'Claude 3 Opus',
        apiType: 'claude',
        endpoint: 'https://api.anthropic.com/v1/messages',
        isPaid: true,
        keyEnv: 'VITE_CLAUDE_API_KEY',
      },
      {
        id: 'gemini-1.5',
        label: 'Gemini 1.5 Pro',
        apiType: 'gemini',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
        isPaid: true,
        keyEnv: 'VITE_GEMINI_API_KEY',
      }
    ],
    selectedModelId: 'llama-3.3-70b-versatile',
  }),
  getters: {
    selectedModel(state) {
      return state.models.find(m => m.id === state.selectedModelId) || state.models[0]
    },
  },
  actions: {
    setSelectedModel(id: string) {
      this.selectedModelId = id
    },
  },
})
