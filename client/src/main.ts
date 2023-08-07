import { createApp } from "vue";
import "./style.css";
import { createRouter, createWebHashHistory } from "vue-router";
import AppVue from "./App.vue";
import Home from "./components/Home.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: "/", component: Home }],
});

const app = createApp(AppVue);
app.use(router);

app.mount("#app");
