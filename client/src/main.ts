import { createApp } from "vue";
import "./style.css";
import { createRouter, createWebHashHistory } from "vue-router";
import AppVue from "./App.vue";
import Login from "./routes/Login.vue";
import Home from "./routes/Home.vue";

export const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    { path: "/", component: Home },
    { path: "/login", name: "login", component: Login },
  ],
});

const app = createApp(AppVue);
app.use(router);

app.mount("#app");
