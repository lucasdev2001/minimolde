<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import BottomNavbar from "./navbar/BottomNavbar.vue";
import { ref } from "vue";

const router = useRouter();
const route = useRoute();
const logOut = () => {
  localStorage.removeItem("token");
  router.push({ name: "Auth" });
};
const currentTime = ref<Date>(new Date());
</script>
<template>
  <div class="drawer lg:drawer-open">
    <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar bg-base-100 border-b-2 rounded-md">
        <div class="navbar-start"></div>

        <div class="navbar-end">
          <button class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
      <RouterView />
    </div>
    <div class="drawer-side">
      <label
        for="dashboard-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul
        class="menu p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col gap-7 border-e-2"
      >
        <div class="flex place-items-center">
          <label
            tabindex="0"
            class="btn btn-ghost btn-circle avatar me-3 btn-lg"
          >
            <div class="rounded-full">
              <img
                src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              />
            </div>
          </label>
          <hgroup class="prose">
            <h3 class="font-medium mb-0">Lucas Pereira</h3>
            <p class="mt-0 text-justify">
              {{ currentTime?.toLocaleDateString() }}
            </p>
          </hgroup>
        </div>
        <div class="flex flex-col gap-3">
          <li>
            <a class="active">
              <i class="fa-solid fa-house"></i>
              Home
            </a>
          </li>
          <li><a class="focus">Files</a></li>
          <li><a class="focus">Inbox</a></li>
        </div>

        <button class="btn btn-primary text-white">Create Task</button>
      </ul>
    </div>
  </div>
</template>
