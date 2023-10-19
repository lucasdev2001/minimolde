<script lang="ts" setup>
import { routeLoading } from "./stores/routeLoading";
import ApiResponseToast from "./components/utils/ApiResponseToast.vue";
</script>

<template>
  <div class="hero min-h-screen bg-base-200" v-if="routeLoading">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <img src="./assets/logo.svg" class="animate-bounce" />
      </div>
    </div>
  </div>

  <ApiResponseToast />
  <RouterView />
</template>
