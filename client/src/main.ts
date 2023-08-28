import { createApp } from "vue";
import "./style.css";
import { createRouter, createWebHashHistory } from "vue-router";
import AppVue from "./App.vue";
import Login from "./routes/Login.vue";
import Home from "./routes/Home.vue";
import axios from "axios";

const isAuthenticated = (token: string | null) => {
  const axiosConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return axios
    .get(import.meta.env.VITE_API_ADDRES + "/validate-token", axiosConfig)
    .then(() => true)
    .catch(() => false);
};

export const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    { path: "/", component: Home, name: "Home" },
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: async to => {
        const canAccess = await isAuthenticated(localStorage.getItem("token"));

        if (canAccess && to.name === "Login") {
          return { name: "Home" };
        }
      },
    },
  ],
});

router.beforeEach(async to => {
  const canAccess = await isAuthenticated(localStorage.getItem("token"));

  if (!canAccess && to.name !== "Login") {
    return { name: "Login" };
  }
});

const app = createApp(AppVue);
app.use(router);

app.mount("#app");
