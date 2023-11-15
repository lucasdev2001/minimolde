<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["submit"]);
defineProps({
  isLoading: Boolean,
});

const email = ref("");

const handleSubmit = () => {
  emit("submit", email.value);
};
</script>
<template>
  <form
    class="flex flex-col justify-evenly gap-3"
    @submit.prevent="handleSubmit"
  >
    <hgroup class="text-center">
      <h1 class="text-3xl">Send reset link</h1>
      <p>Please enter your email</p>
    </hgroup>

    <label for="email" class="label-text"
      >Email
      <input
        name="email"
        type="email"
        class="input input-bordered input-primary w-full"
        required
        v-model="email"
      />
    </label>

    <button class="btn btn-primary text-white">
      <span class="loading loading-spinner" v-if="isLoading"></span>
      reset
    </button>
  </form>
  <slot> </slot>
</template>
