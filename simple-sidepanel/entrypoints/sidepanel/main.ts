import { createApp } from 'vue'
import '@/assets/main.css'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

const app = createApp(App)

app.use(ui)
app.mount('#app')