<script setup lang="ts">
import { reactive } from "vue";

const emit = defineEmits(["submit"]);
defineProps({
  isLoading: Boolean,
});

const proxyEmployee = reactive({
  name: "",
  email: "",
  password: "",
});

const handleSubmit = () => {
  emit("submit", proxyEmployee);
};
</script>
<template>
  <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
    <hgroup class="text-center">
      <h1 class="text-3xl">Hello there, Welcome!</h1>
      <p>Please enter your details</p>
    </hgroup>
    <label for="name" class="label-text"
      >Name
      <input
        name="name"
        type="text"
        class="input input-bordered input-primary w-full"
        required
        v-model="proxyEmployee.name"
      />
    </label>
    <label for="email" class="label-text"
      >Email
      <input
        name="email"
        type="email"
        class="input input-bordered input-primary w-full"
        v-model="proxyEmployee.email"
        required
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

    <button class="btn btn-primary text-white">
      <span class="loading loading-spinner" v-if="isLoading"></span>
      Sign up
    </button>
  </form>
</template>
