<script setup lang="ts">
const emit = defineEmits(["submit"]);
defineProps({
  isLoading: Boolean,
});

const handleSubmit = (event: Event) => {
  emit("submit", event);
};
</script>
<template>
  <form class="flex flex-col gap-3" @submit="handleSubmit">
    <hgroup class="prose text-center">
      <h1 class="mb-0 font-thin">Hello there, Welcome!</h1>
      <p>Please enter your details</p>
    </hgroup>
    <label for="name" class="label-text"
      >Name
      <input
        name="name"
        type="text"
        class="input input-bordered input-primary w-full"
        required
      />
    </label>
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

    <button class="btn btn-primary text-white">
      <span class="loading loading-spinner" v-if="isLoading"></span>
      Sign up
    </button>
  </form>
</template>
