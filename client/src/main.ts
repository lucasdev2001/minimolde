import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "./style.css";

import AppVue from "./App.vue";
import axios from "axios";

//views
import NavbarVue from "./components/navbar/Navbar.vue";
import Authvue from "./views/Auth.vue";
import FilesVue from "./views/Files.vue";
import HomeVue from "./views/Home.vue";
import TeamsVue from "./views/Teams.vue";
import VerifyEmailVue from "./views/VerifyEmail.vue";

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
        },
        {
          path: "files",
          name: "files",
          component: FilesVue,
        },
        {
          path: "teams/:team",
          name: "teams",
          component: TeamsVue,
        },
        {
          path: "manage",
          name: "manage",
          children: [
            {
              path: "manage-teams",
              name: "manage-teams",
              component: HomeVue,
            },
            {
              path: "manage-employees",
              name: "manage-employees",
              component: HomeVue,
            },
            {
              path: "manage-tasks",
              name: "manage-tasks",
              component: HomeVue,
            },
          ],
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "/",
          name: "Auth",
          component: Authvue,
        },
        {
          path: "verify-email/:token",
          name: "verify-email",
          component: VerifyEmailVue,
        },
      ],
    },
  ],
});

router.beforeEach(async to => {
  if (to.name !== "Auth" && to.name !== "verify-email") {
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
