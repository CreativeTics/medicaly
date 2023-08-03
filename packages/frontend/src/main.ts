import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import Vidle from "v-idle-3";
import VueSignaturePad from "vue-signature-pad";

import { registerGlobalComponents } from "./config/register-global-components";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const app = createApp(App);
registerGlobalComponents(app);

app.use(pinia).use(router).use(Vidle).use(VueSignaturePad).mount("#app");
