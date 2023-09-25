<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
</script>
<template>
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
</template>
