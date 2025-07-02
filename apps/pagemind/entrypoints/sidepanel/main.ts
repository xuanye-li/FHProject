import { createApp } from 'vue'
import '@/assets/main.css'
import ui from '@nuxt/ui/vue-plugin'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

console.log(import.meta.env.VITE_TEST_LICENSE)

app.use(ui)
app.use(createPinia())
app.mount('#app')
