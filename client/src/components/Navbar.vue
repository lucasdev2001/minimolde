<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import NavDesktop from "./navbar/NavDesktop.vue";
import Drawer from "./navbar/Drawer.vue";
const router = useRouter();
const route = useRoute();
const logOut = () => {
  localStorage.removeItem("token");
  router.push({ name: "Auth" });
};
</script>
<template>
  <nav className="navbar bg-base-100 ">
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
        <label for="drawer" class="drawer-button">
          <li>
            <a class="active">{{ route.name?.toString() }}</a>
          </li>
        </label>
      </ul>
    </div>
    <!-- desktop -->

    <NavDesktop />

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

  <Drawer />

  <RouterView />
</template>
