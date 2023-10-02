import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "./style.css";

import AppVue from "./App.vue";
import axios from "axios";

//views
import NavbarVue from "./components/Navbar.vue";
import Authvue from "./views/Auth.vue";
import FilesVue from "./views/Files.vue";
import HomeVue from "./views/Home.vue";

const isAuthenticated = (token: string | null) => {
  const axiosConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  return axios
    .get(import.meta.env.VITE_API_ADDRES + "/validate-token", axiosConfig)
    .then(res => {
      return res.data;
    })
    .catch(() => false);
};

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/home",
      component: NavbarVue,
      children: [
        {
          path: "/home",
          name: "home",
          component: HomeVue,
          meta: {
            icon: "teste",
          },
        },
        {
          path: "files",
          name: "files",
          component: FilesVue,
        },
      ],
    },
    {
      path: "/",
      name: "Auth",
      component: Authvue,
    },
  ],
});

router.beforeEach(async to => {
  if (to.name !== "Auth") {
    const token = localStorage.getItem("token");
    const canAccess = await isAuthenticated(token);
    if (!canAccess) {
      return { name: "Auth" };
    }
  }
});

const app = createApp(AppVue);
app.use(router);

app.mount("#app");
