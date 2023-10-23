import { createRouter, createWebHashHistory } from "vue-router";
import NavbarVue from "./components/navbar/Navbar.vue";
import FilesVue from "./views/files/Files.vue";
import HomeVue from "./views/home/Home.vue";
import TeamsVue from "./views/teams/Teams.vue";
import AuthVue from "./views/auth/Auth.vue";
import VerifyEmailVue from "./views/auth/VerifyEmail.vue";
import axios from "axios";
import ManageTeamsVue from "./views/manage/ManageTeams.vue";
import jwtDecode from "jwt-decode";
import { Token } from "./types";
import { routeLoading } from "./stores/routeLoading";
import ManageEmployeesVue from "./views/manage/ManageEmployees.vue";
import InboxVue from "./views/inbox/Inbox.vue";
import ProfileVue from "./views/profile/Profile.vue";

export const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/home",
      component: NavbarVue,
      beforeEnter: async (_to, _from, next) => {
        const token = localStorage.getItem("token");
        routeLoading.value = true;
        const canAccess = await isAuthenticated(token);
        routeLoading.value = false;

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
          path: "profile",
          name: "profile",
          component: ProfileVue,
        },
        {
          path: "files",
          name: "files",
          component: FilesVue,
        },
        {
          path: "inbox",
          name: "inbox",
          component: InboxVue,
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
              component: ManageTeamsVue,
            },
            {
              path: "manage-employees",
              name: "manage-employees",
              component: ManageEmployeesVue,
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
          routeLoading.value = true;
          const canAccess = await isAuthenticated(token);
          routeLoading.value = false;
          if (canAccess) {
            return { name: "home" };
          } else {
            localStorage.removeItem("token");
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

router.afterEach(() => {});

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
