import { createRouter, createWebHashHistory } from "vue-router";
import NavbarVue from "./components/navbar/Navbar.vue";
import FilesVue from "./views/Files.vue";
import HomeVue from "./views/Home.vue";
import TeamsVue from "./views/Teams.vue";
import AuthVue from "./views/Auth.vue";
import VerifyEmailVue from "./views/VerifyEmail.vue";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/home",
      component: NavbarVue,
      meta: {
        employee: (() => {
          try {
            const token = localStorage.getItem("token");
            if (token) {
              return jwtDecode(token);
            }
          } catch (error) {
            return null;
          }
        })(),
      },

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

router.beforeEach(async to => {
  console.log(to.meta.employee);

  if (to.meta.requiresAuth !== false) {
    const token = localStorage.getItem("token");
    const canAccess = await isAuthenticated(token);
    if (!canAccess) {
      localStorage.removeItem("token");
      return { name: "Auth" };
    }
  }
});
