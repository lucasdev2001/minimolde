<script setup lang="ts">
import { reactive } from "vue";

const emit = defineEmits(["submit"]);
defineProps({
  isLoading: Boolean,
});

const proxyEmployee = reactive({
  email: "",
  password: "",
});

const handleSubmit = () => {
  emit("submit", proxyEmployee);
};
</script>
<template>
  <form
    class="flex flex-col justify-evenly gap-3"
    @submit.prevent="handleSubmit"
  >
    <hgroup class="text-center">
      <h1 class="text-3xl">Hello there, Welcome!</h1>
      <p>Please enter your details</p>
    </hgroup>
    <label for="email" class="label-text"
      >Email
      <input
        name="email"
        type="email"
        class="input input-bordered input-primary w-full"
        required
        v-model="proxyEmployee.email"
      />
    </label>

    <label for="password" class="label-text"
      >Password
      <input
        name="password"
        type="password"
        class="input input-bordered input-primary w-full"
        required
        v-model="proxyEmployee.password"
      />
    </label>

    <slot></slot>

    <button class="btn btn-primary text-white">
      <span class="loading loading-spinner" v-if="isLoading"></span>
      Log In
    </button>
  </form>
</template>
