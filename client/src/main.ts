import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'katex/dist/katex.min.css'
import './styles/main.css'
import { applySiteMeta } from './config'

applySiteMeta()

createApp(App).use(router).mount('#app')
