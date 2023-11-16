<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import jwtDecode from "jwt-decode";
import handleResponseMessage from "../../utils/handleResponseMessage";

//uses
const route = useRoute();
const router = useRouter();
const token = route.params.token;

onMounted(() => {
  try {
    jwtDecode(token as string);
  } catch (error) {
    router.push({ name: "Auth" });
  }
});

//refs
const passwords = reactive({
  password: "",
  confirmPassword: "",
});
const isLoading = ref(false);
//handlers

const handleResetPassword = async () => {
  if (passwords.password !== passwords.confirmPassword) {
    handleResponseMessage("passwords dosen't match", false);
    throw new Error("passwords dosen't match");
  }
  isLoading.value = true;
  try {
    const res = await axios.put(
      import.meta.env.VITE_RESET_PASSWORD,
      passwords,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    handleResponseMessage(res.data, true);
    router.push({ name: "Auth" });
  } catch (error) {
    handleResponseMessage((error as Error).message, false);
  }
  isLoading.value = false;
};
</script>
<template>
  <main
    class="container mx-auto flex flex-col justify-evenly place-items-center h-screen"
  >
    <figure class="flex justify-center">
      <img src="/logo.svg" class="object-cover" />
    </figure>
    <hgroup class="text-center">
      <h3 class="text-5xl">New password</h3>
      <p>please enter your new password</p>
    </hgroup>
    <form class="grid p-3 gap-3.5" @submit.prevent="handleResetPassword">
      <label for="email">
        New Password
        <input
          type="password"
          class="input input-bordered input-primary w-full"
          id="password"
          required
          v-model="passwords.password"
        />
      </label>

      <label for="password">
        Confirm Password
        <input
          type="password"
          class="input input-bordered input-primary w-full"
          required
          v-model="passwords.confirmPassword"
        />
      </label>

      <slot name="reset-password"> </slot>
      <button class="btn btn-primary" :disabled="isLoading">
        Reset

        <span
          class="loading loading-spinner loading-xs"
          v-if="isLoading"
        ></span>
      </button>
    </form>
  </main>
</template>
