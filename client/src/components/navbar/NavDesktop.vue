<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
</script>
<template>
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
</template>
