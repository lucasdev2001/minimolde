import { createApp } from "vue";
import { createPinia } from "pinia";

import "./style.css";

import AppVue from "./App.vue";

import { router } from "./router";

const pinia = createPinia();
const app = createApp(AppVue);
app.use(router);
app.use(pinia);

app.mount("#app");
