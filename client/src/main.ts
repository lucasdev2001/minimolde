import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "./style.css";

import AppVue from "./App.vue";
import Login from "./routes/Login.vue";
import Home from "./routes/Home.vue";
import axios from "axios";
import NavbarVue from "./components/Navbar.vue";
import FilesVue from "./routes/Files.vue";
import TasksVue from "./routes/Tasks.vue";

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
    {
      path: "/",
      component: NavbarVue,

      children: [
        {
          name: "Home",
          component: Home,
          path: "/",
        },
        {
          name: "Files",
          component: FilesVue,
          path: "/files",
        },
        {
          name: "Tasks",
          component: TasksVue,
          path: "/tasks",
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: async to => {
        if (to.name === "Login") {
          const token = localStorage.getItem("token");
          const canAccess = await isAuthenticated(token);
          if (canAccess) {
            return { name: "Home" };
          }
        }
      },
    },
  ],
});

router.beforeEach(async to => {
  if (to.name !== "Login") {
    const token = localStorage.getItem("token");
    const canAccess = await isAuthenticated(token);
    if (!canAccess) {
      return { name: "Login" };
    }
  }
});

const app = createApp(AppVue);
app.use(router);

app.mount("#app");
