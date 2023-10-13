<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import kebabCase from "lodash/kebabCase";

import { Employee } from "../../types";
import jwt_decode from "jwt-decode";
import axios from "axios";
import BottomNavbar from "./BottomNavbar.vue";

const codedToken = localStorage.getItem("token");
const employee = ref<Employee>({
  _id: "",
  email: "",
  name: "",
  roles: [],
  teams: [],
  profilePicture: "",
});

onBeforeMount(async () => {
  if (codedToken) {
    const decoded = jwt_decode(codedToken) as Employee;
    const response = await axios.get(
      import.meta.env.VITE_API_ADDRES_FIND_ONE_EMPLOYEE + decoded._id
    );
    employee.value = response.data;
  }
  console.log(employee.value);
});

const router = useRouter();
const route = useRoute();

const logout = () => {
  localStorage.removeItem("token");
  router.push({ name: "Auth" });
};

const currentTime = ref<Date>(new Date());
</script>
<template>
  <div class="drawer sm:drawer-open">
    <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar bg-base- rounded-md">
        <div class="navbar-start sm:hidden">
          <div class="avatar">
            <div class="w-14 rounded-full cursor-pointer hover:border-2">
              <img :src="employee.profilePicture" />
            </div>
          </div>
        </div>
        <div class="navbar-start">
          <div class="text-sm breadcrumbs hidden sm:block">
            <ul>
              <template v-for="routePath in route.path.split('/')">
                <li>
                  <label for="dashboard-drawer">
                    <a>{{
                      routePath.charAt(0).toUpperCase() + routePath.slice(1)
                    }}</a>
                  </label>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <div class="navbar-end">
          <button class="btn btn-ghost btn-circle">
            <div class="indicator">
              <i class="fa-solid fa-bell text-lg"></i>
              <span class="badge badge-xs badge-primary indicator-item">1</span>
            </div>
          </button>
        </div>
      </div>
      <RouterView />
    </div>
    <div class="drawer-side z-50">
      <label
        for="dashboard-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul
        class="menu min-h-full bg-base-100 text-base-content flex flex-col gap-7 p-3"
      >
        <div class="dropdown">
          <label tabindex="0" class="">
            <div class="flex place-items-center">
              <div class="avatar m-3">
                <div class="w-24 rounded-full cursor-pointer hover:border-2">
                  <img :src="employee.profilePicture" />
                </div>
              </div>
              <hgroup class="prose">
                <h3 class="font-medium mb-0">{{ employee.name }}</h3>

                <p class="mt-0 text-justify">
                  {{ currentTime?.toLocaleDateString() }}
                </p>
              </hgroup>
            </div>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a>Profile</a></li>
            <li><a @click="logout">Logout</a></li>
          </ul>
        </div>

        <div class="flex flex-col gap-3">
          <li>
            <a class="focus" @click="router.push({ name: 'home' })">
              Home
              <i class="ms-auto fa-solid fa-house"></i>
            </a>
          </li>
          <li>
            <a class="focus" @click="router.push({ name: 'files' })">
              Files
              <i class="ms-auto fa-solid fa-box-archive"></i>
            </a>
          </li>
          <ul class="menu bg-base-200 rounded-box">
            <li>
              <details open>
                <summary>Teams</summary>
                <ul>
                  <template v-for="team in employee.teams">
                    <li>
                      <a
                        class="truncate"
                        @click="
                          router.push({
                            name: 'teams',
                            params: { team: kebabCase(team.name) },
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
        </div>
      </ul>
    </div>
  </div>
  <BottomNavbar />
</template>
