<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import BottomNavbar from "./BottomNavbar.vue";

import { employee } from "../../stores/employeeStore";
import { onMounted, ref } from "vue";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { Team, Token } from "../../types";
import Profile from "./Profile.vue";
import { client } from "../../microservices/broker";

//refs
const route = useRoute();
const notificationsCount = ref(0);
const router = useRouter();
const teams = ref<Team[]>([]);

//functions
const logout = () => {
  localStorage.removeItem("token");
  router.push({ name: "Auth" });
};

const fetchTeams = async () => {
  try {
    const res = await axios.get(
      import.meta.env.VITE_API_EMPLOYEE_TEAMS + employee.value._id,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//lifecycles

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token) as Token;
    const fetchEmployee = await axios.get(
      import.meta.env.VITE_API_EMPLOYEE + decoded._id,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    employee.value = fetchEmployee.data;
  }

  teams.value = await fetchTeams();
});

client.on("message", async topic => {
  if (topic === "notifications") {
    notificationsCount.value++;
  }

  if (topic === "teams") {
    teams.value = await fetchTeams();
  }
});
</script>
<template>
  <div class="drawer sm:drawer-open">
    <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar rounded-md flex">
        <div class="grow">
          <div class="text-sm breadcrumbs">
            <ul>
              <template v-for="routePath in route.path.split('/')">
                <li>
                  <label for="dashboard-drawer">
                    <a>{{ decodeURIComponent(routePath) }}</a>
                  </label>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <div class="flex-shrink">
          <button
            class="btn btn-ghost btn-circle"
            @click="
              () => {
                router.push({ name: 'inbox' });
                notificationsCount = 0;
              }
            "
          >
            <div class="indicator">
              <i class="fa-solid fa-bell text-lg"></i>
              <span
                class="badge badge-xs badge-primary indicator-item"
                :class="notificationsCount > 0 && 'animate-pulse'"
                v-if="notificationsCount > 0 && route.name !== 'inbox'"
                >{{ notificationsCount }}</span
              >
            </div>
          </button>
        </div>
      </div>
      <div class="p-3">
        <RouterView />
      </div>
    </div>
    <div class="drawer-side z-50">
      <label
        for="dashboard-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul class="menu p-4 w-80 min-h-full z-50 bg-base-100 justify-between">
        <div class="flex flex-col gap-3">
          <Profile>
            <template #profile-actions>
              <li><a @click="logout">Logout</a></li>
            </template>
          </Profile>
          <li>
            <a class="bg-base-200" @click="router.push({ name: 'home' })">
              Home
              <i class="fa-solid fa-house ms-auto"></i>
            </a>
          </li>
          <li>
            <a class="bg-base-200" @click="router.push({ name: 'files' })">
              Files
              <i class="fa-solid fa-box-archive ms-auto"></i>
            </a>
          </li>
          <li>
            <a class="bg-base-200" @click="router.push({ name: 'inbox' })">
              Inbox
              <i class="fa-solid fa-inbox ms-auto"></i>
            </a>
          </li>
          <ul
            class="menu menu-xs bg-base-200 rounded-lg max-w-xs w-full max-h-96 sm:overflow-clip overflow-auto hover:overflow-auto"
          >
            <li>
              <details open>
                <summary class="p-2">
                  Teams
                  <i class="fa-solid fa-user-group ms-auto"></i>
                </summary>
                <ul>
                  <template v-for="team in teams">
                    <li>
                      <a
                        class="p-2"
                        @click="
                          router.push({
                            name: 'teams',
                            params: {
                              team: team.name,
                            },
                          })
                        "
                      >
                        {{ team.name }}
                      </a>
                    </li>
                  </template>
                </ul>
              </details>
            </li>
          </ul>

          <ul
            class="menu menu-xs bg-base-200 rounded-lg max-w-xs w-full"
            v-if="employee.roles?.includes('manager')"
          >
            <li>
              <details open>
                <summary class="p-2">
                  Manage
                  <i class="fa-solid fa-briefcase ms-auto fa-lg"></i>
                </summary>
                <ul>
                  <li>
                    <a
                      class="p-2"
                      @click="router.push({ name: 'manage-teams' })"
                    >
                      Teams
                    </a>
                  </li>
                  <li>
                    <a
                      class="p-2"
                      @click="router.push({ name: 'manage-employees' })"
                      >Employees</a
                    >
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <li class="justify-self-end">
          <a class="bg-base-200" @click="logout">
            Logout
            <i class="fa-solid fa-right-from-bracket ms-auto"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <BottomNavbar />
</template>
