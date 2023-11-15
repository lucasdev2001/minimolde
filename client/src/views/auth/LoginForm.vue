<script setup lang="ts">
const emit = defineEmits(["submit", "teste"]);
defineProps({
  isLoading: Boolean,
});

const handleSubmit = (e: Event) => {
  emit("submit", e);
};
</script>
<template>
  <form class="flex flex-col justify-evenly gap-3" @submit="handleSubmit">
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
      />
    </label>

    <label for="password" class="label-text"
      >Password
      <input
        name="password"
        type="password"
        class="input input-bordered input-primary w-full"
        required
      />
    </label>

    <slot></slot>

    <button class="btn btn-primary text-white">
      <span class="loading loading-spinner" v-if="isLoading"></span>
      Log In
    </button>
  </form>
</template>
