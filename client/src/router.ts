import { createRouter, createWebHashHistory } from "vue-router";
import NavbarVue from "./components/navbar/Navbar.vue";
import FilesVue from "./views/Files.vue";
import HomeVue from "./views/Home.vue";
import TeamsVue from "./views/Teams.vue";
import AuthVue from "./views/Auth.vue";
import VerifyEmailVue from "./views/VerifyEmail.vue";
import axios from "axios";
import ManageTeamsVue from "./views/ManageTeams.vue";
import jwtDecode from "jwt-decode";
import { Token } from "./types";

export const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/home",
      component: NavbarVue,
      beforeEnter: async (to, from, next) => {
        const token = localStorage.getItem("token");
        const canAccess = await isAuthenticated(token);

        if (canAccess) {
          return next();
        } else {
          localStorage.removeItem("token");
          return next({ name: "Auth" });
        }
      },

      children: [
        {
          path: "",
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
              path: "Manage-teams",
              name: "manage-teams",
              component: ManageTeamsVue,
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
      beforeEnter: async () => {
        const token = localStorage.getItem("token");
        if (token) {
          const canAccess = await isAuthenticated(token);
          if (canAccess) {
            return { name: "home" };
          }
        }
      },
      children: [
        {
          path: "/",
          name: "Auth",
          meta: {
            requiresAuth: false,
          },
          component: AuthVue,
        },
        {
          path: "verify-email/:token",
          name: "verify-email",
          meta: {
            requiresAuth: false,
          },
          component: VerifyEmailVue,
        },
      ],
    },
  ],
});

router.beforeEach(to => {
  if (to.meta.requiresAuth !== false) {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        return { name: "Auth" };
      }
    }
  }
});

const isTokenExpired = (token: string) =>
  Date.now() / 1000 >= (jwtDecode(token) as Token).exp;

const isAuthenticated = async (token: string | null) => {
  //lazzy called
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
