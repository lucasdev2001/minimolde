<script setup lang="ts">
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useRoute } from "vue-router";
import { Employee } from "../types";
import { onBeforeMount, ref } from "vue";

const route = useRoute();
const token = route.params.token as string;
const employee = ref<Employee>({
  _id: "",
  email: "",
  name: "",
  profilePicture: "",
  roles: [],
  teams: [],
});

onBeforeMount(() => {
  try {
    employee.value = jwtDecode(token);
  } catch (error) {
    console.log(error);
  }
});

const isLoading = ref(false);

const verifyAccount = async () => {
  const axiosConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  try {
    isLoading.value = true;
    const response = await axios.get(
      import.meta.env.VITE_API_ADDRES_VERIFY_ACCOUNT,
      axiosConfig
    );
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <div class="flex justify-center">
          <img src="../assets/logo.svg" class="w-40" />
        </div>
        <br />
        <h1 class="text-3xl font-bold text-justify">
          Welcome! {{ employee.name }}
        </h1>
        <p class="py-6 text-justify">
          We are so glad to see you here at
          <span class="underline decoration-primary">Minimolde</span>, if your
          e-mail is:
          <span class="font-extrabold">{{ employee.email }}</span> click the
          button bellow to verify your account!
        </p>
        <button
          class="btn btn-primary"
          @click="verifyAccount"
          :disabled="isLoading"
        >
          <span class="loading loading-spinner" v-if="isLoading"></span>
          verify
        </button>
      </div>
    </div>
  </div>
</template>
