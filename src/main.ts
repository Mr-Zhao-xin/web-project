// import { createApp } from 'vue'
// import App from './App.vue'


// createApp(App).use(store).use(router).mount('#app')
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import "./permission"
import { setupStore } from "@/store";
const app = createApp(App)
import router from '@/router'




setupStore(app);
app.use(router)
// app.use(store)
app.use(ElementPlus)
app.mount('#app')
