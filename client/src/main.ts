import { createApp } from "vue";
import "./style.css";

import AppVue from "./App.vue";
import axios from "axios";

import { router } from "./router";

const app = createApp(AppVue);
app.use(router);

app.mount("#app");
