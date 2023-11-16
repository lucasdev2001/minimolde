<script lang="ts" setup>
import { ref } from "vue";
import LoginForm from "./LoginForm.vue";
import SignupForm from "./SignupForm.vue";
import axios, { AxiosError } from "axios";
import { useRouter } from "vue-router";
import RequestPassword from "./RequestPassword.vue";
import handleResponseMessage from "../../utils/handleResponseMessage";
import { Employee } from "../../types";

//refs
const isNwEmployee = ref(false);
const nwEmployeeDialog = ref<HTMLDialogElement>();
const router = useRouter();
const isLoading = ref(false);
const authView = ref<"login" | "signup" | "reset-password">("login");

//consts
const isNwEmployeeDialogOpen = ref(false);

//funções
const toggleForm = () => {
  isNwEmployee.value = !isNwEmployee.value;
};

const toggleNwEmployeeDialog = () => {
  if (nwEmployeeDialog.value?.open) {
    nwEmployeeDialog.value?.close();
    isNwEmployeeDialogOpen.value = false;
    toggleForm();
  } else {
    nwEmployeeDialog.value?.show();
    isNwEmployeeDialogOpen.value = true;
  }
};

const handleSignup = async (employee: Employee) => {
  isLoading.value = true;

  try {
    await axios.post(import.meta.env.VITE_API_CREATE_ACCOUNT, employee);
    authView.value = "login";
    toggleNwEmployeeDialog();
  } catch (error) {
    handleResponseMessage(String((error as AxiosError).response?.data), false);
  }
  isLoading.value = false;
};

const handleLogin = async (employee: Employee) => {
  isLoading.value = true;

  try {
    const res = await axios.post(import.meta.env.VITE_API_AUTH, employee);
    localStorage.setItem("token", res.data);
    isLoading.value = false;
    router.push({ name: "home" });
  } catch (error) {
    isLoading.value = false;
    handleResponseMessage(String((error as AxiosError).response?.data), false);
  }
};

const handleRequestPassword = async (email: string) => {
  isLoading.value = true;
  try {
    const res = await axios.post(import.meta.env.VITE_REQUEST_RESET_PASSWORD, {
      email: email,
    });
    handleResponseMessage(res.data, true);
    authView.value = "login";
  } catch (error) {
    handleResponseMessage(String((error as AxiosError).response?.data), false);
  }
  isLoading.value = false;
};
</script>

<template>
  <main
    class="h-screen lg:flex flex-row"
    :class="isNwEmployeeDialogOpen && 'blur-2xl'"
  >
    <aside class="hidden lg:block lg:grow">
      <video
        src="/white-label.mp4"
        class="object-cover h-full w-full rounded-e-sm"
        autoplay
        loop
        muted
      ></video>
    </aside>
    <article
      class="flex flex-col h-full lg:basis-1/2 place-items-center justify-around p-3"
    >
      <figure>
        <img src="/logo.svg" class="w-32" />
      </figure>

      <LoginForm
        v-if="authView === 'login'"
        @submit="handleLogin"
        :is-loading="isLoading"
      >
        <a class="link label-text self-end" @click="authView = 'reset-password'"
          >Forgot your password ?</a
        >
      </LoginForm>
      <SignupForm
        v-if="authView === 'signup'"
        @submit="handleSignup"
        :is-loading="isLoading"
      />

      <RequestPassword
        v-if="authView === 'reset-password'"
        :is-loading="isLoading"
        @submit="handleRequestPassword"
      >
        <p class="self-center label-text">
          All set ?
          <a class="link" href="#" @click="authView = 'login'">Sign in</a>
        </p>
      </RequestPassword>

      <p class="self-center label-text" v-if="authView === 'login'">
        Don't have an account yet ?
        <a class="link" href="#" @click="authView = 'signup'">Sign up</a>
      </p>
      <p class="self-center label-text" v-if="authView === 'signup'">
        Already have an account ?
        <a class="link" href="#" @click="authView = 'login'">Sign in</a>
      </p>
    </article>

    <template v-if="nwEmployeeDialog?.open">
      <h1>I am open</h1>
    </template>
  </main>

  <dialog class="modal modal-top sm:modal-middle" ref="nwEmployeeDialog">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Welcome 🥳🥳🥳</h3>
      <p class="py-4">
        Your account has been created successfully! check your e-mail to verify
        your account
      </p>
      <div class="modal-action">
        <button
          class="btn btn-primary text-white"
          @click="toggleNwEmployeeDialog"
          type="submit"
        >
          Log In
        </button>
      </div>
    </form>
  </dialog>
</template>
