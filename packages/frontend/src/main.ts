import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
// @ts-ignore
import VueSignaturePad from 'vue-signature-pad'

import { registerGlobalComponents } from './config/register-components'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App)
registerGlobalComponents(app)

app.use(pinia).use(router).use(VueSignaturePad).mount('#app')
