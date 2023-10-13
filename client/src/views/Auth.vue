<script lang="ts" setup>
import { ref } from "vue";
import LoginForm from "../components/auth/LoginForm.vue";
import SignupForm from "../components/auth/SignupForm.vue";
import axios, { AxiosError } from "axios";
import Toast from "../components/Toast.vue";
import { useRouter } from "vue-router";

//refs
const isNwEmployee = ref(false);
const errorMessage = ref<string | null>("");
const nwEmployeeDialog = ref<HTMLDialogElement>();
const router = useRouter();

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

const handleErrorMessage = (message: string) => {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = null;
  }, 3000);
};

const handleSignUp = (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  axios
    .post("http://localhost:3000/auth/create-account", formJson)
    .then((response) => {
      console.log(response);
      toggleNwEmployeeDialog();
    })
    .catch((error: AxiosError) => {
      handleErrorMessage((error.response?.data as string) ?? error.message);
    });
};

const handleSignIn = (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  axios
    .post("http://localhost:3000/auth", formJson)
    .then((response) => {
      localStorage.setItem("token", response.data);
      router.push({ name: "home" });
    })
    .catch((error: AxiosError) => {
      handleErrorMessage((error.response?.data as string) ?? error.message);
    });
};
</script>

<template>
  <main
    class="h-screen lg:flex flex-row"
    :class="isNwEmployeeDialogOpen && 'blur-2xl'"
  >
    <aside class="hidden lg:block lg:grow">
      <video
        src="../assets/white-label.mp4"
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
        <img src="../assets/logo.svg" class="w-32" />
      </figure>

      <LoginForm v-if="!isNwEmployee" @submit="handleSignIn" />
      <SignupForm v-if="isNwEmployee" @submit="handleSignUp" />

      <p class="self-center label-text" v-if="!isNwEmployee">
        Don't have an account yet ?
        <a class="link" href="#" @click="toggleForm()">Sign up</a>
      </p>
      <p class="self-center label-text" v-if="isNwEmployee">
        Already have an account ?
        <a class="link" href="#" @click="toggleForm()">Sign in</a>
      </p>
    </article>

    <template v-if="nwEmployeeDialog?.open">
      <h1>I am open</h1>
    </template>
  </main>

  <Toast v-if="errorMessage" :message="errorMessage" :icon="'⚠️'" />

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
          @click="toggleNwEmployeeDialog()"
        >
          Log In
        </button>
      </div>
    </form>
  </dialog>
</template>
