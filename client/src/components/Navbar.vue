<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const logOut = () => {
  localStorage.removeItem("token");
  router.push({ name: "Auth" });
};
</script>
<template>
  <nav className="navbar bg-base-100 container mx-auto">
    <div className="navbar-start">
      <button class="btn btn-ghost btn-circle">
        <div class="indicator">
          <i class="fa-regular fa-bell text-lg"></i>
          <span class="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
    </div>

    <div class="navbar-center lg:hidden">
      <ul class="menu menu-horizontal px-1 flex">
        <li>
          <a class="active">{{ route.name?.toString() }}</a>
        </li>
      </ul>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 flex gap-10">
        <li>
          <a
            @click="router.push({ name: 'Home' })"
            :class="{ active: route.name === 'Home' }"
          >
            home
            <i class="fa-solid fa-house"></i>
          </a>
        </li>
        <li>
          <a
            @click="router.push({ name: 'Files' })"
            :class="{ active: route.name === 'Files' }"
          >
            files
            <i class="fa-solid fa-box-archive"></i>
          </a>
        </li>
        <li>
          <a
            @click="router.push({ name: 'Tasks' })"
            :class="{ active: route.name === 'Tasks' }"
          >
            tasks
            <i class="fa-solid fa-check-to-slot"></i>
          </a>
        </li>
      </ul>
    </div>

    <div className="navbar-end">
      <div className="dropdown dropdown-end">
        <label tabIndex="{0}" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              src="https://source.boringavatars.com/beam/120/dasd?colors=264653,f4a261,e76f51"
              alt="avatar"
            />
          </div>
        </label>
        <ul
          tabIndex="{0}"
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li class="lg:hidden">
            <label for="drawer" class="drawer-button cursor-pointer"
              >menu</label
            >
          </li>
          <li>
            <a className="justify-between"> Profile </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click="logOut">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <br />

  <div class="drawer drawer-end z-50">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center"></div>
    <div class="drawer-side">
      <label for="drawer" class="drawer-overlay"></label>
      <ul
        class="menu p-4 0 min-h-full bg-base-200 text-base-content w-1/2 flex gap-4"
      >
        <label for="drawer" class="drawer-button">
          <li>
            <a
              @click="router.push({ name: 'Home' })"
              :class="{ active: route.name === 'Home' }"
            >
              <i class="fa-solid fa-house"></i>
              home
            </a>
          </li>
        </label>
        <label for="drawer" class="drawer-button">
          <li>
            <a
              @click="router.push({ name: 'Files' })"
              :class="{ active: route.name === 'Files' }"
            >
              <i class="fa-solid fa-box-archive"></i>
              files
            </a>
          </li>
        </label>
        <label for="drawer" class="drawer-button">
          <li>
            <a
              @click="router.push({ name: 'Tasks' })"
              :class="{ active: route.name === 'Tasks' }"
            >
              <i class="fa-solid fa-check-to-slot"></i>
              tasks
            </a>
          </li>
        </label>
      </ul>
    </div>
  </div>
  <RouterView />
</template>
