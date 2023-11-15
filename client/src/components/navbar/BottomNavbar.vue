<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>
<template>
  <div class="btm-nav text-center btm-nav-sm z-40 sm:hidden mt-52">
    <button class="hover:active">
      <label for="dashboard-drawer">
        <i class="fa-solid fa-bars"></i>
      </label>
    </button>

    <button class="hover:active" @click="router.push({ name: 'home' })">
      <i class="fa-solid fa-house"></i>
    </button>

    <button class="hover:active" @click="router.push({ name: 'files' })">
      <i class="fa-solid fa-box-archive"></i>
    </button>
  </div>
</template>
