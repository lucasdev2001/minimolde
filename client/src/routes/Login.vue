<script lang="ts" setup>
import axios, { AxiosError } from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Toast from "../components/Toast.vue";

const router = useRouter();
const loginForm = ref({});
const isNwUser = ref(false);
const isLoading = ref(false);
const errorMessage = ref<undefined | string>(undefined);
const nwUserModal = ref<HTMLDialogElement>();

const handleerrorMessage = (message: string) => {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = undefined;
  }, 3000);
};

const handleSubmit = (event: Event) => {
  event.preventDefault();
  const formData = new FormData(loginForm.value as HTMLFormElement);
  const employee = Object.fromEntries(formData.entries());

  if (isNwUser.value && employee.password !== employee.confirmPassword) {
    const message = "passwords dosen't match";
    handleerrorMessage(message);

    throw (new Error().message = message);
  }

  const path = isNwUser.value ? "/employees" : "/employees/auth";
  isLoading.value = true;
  axios
    .post(import.meta.env.VITE_API_ADDRES + path, employee)
    .then(res => {
      if (!isNwUser.value) {
        localStorage.setItem("token", res.data);
        router.push({ name: "Home" });
      } else {
        (nwUserModal.value as HTMLDialogElement).showModal();
      }
    })
    .catch((err: AxiosError) => {
      handleerrorMessage((err.response?.data as string) ?? err.message);
    })
    .finally(() => (isLoading.value = false));
};

const handleNwUserModalClose = () => {
  isNwUser.value = !isNwUser;
  nwUserModal.value?.close();
};
</script>

<template>
  <main
    class="container mx-auto h-screen flex"
    :class="nwUserModal?.open && 'blur-2xl'"
  >
    <div
      class="m-auto w-full justify-center px-3 grid lg:flex-row space-y-3 lg:flex gap-4"
    >
      <figure class="px-3 lg:w-1/2">
        <video autoplay muted loop class="rounded-lg">
          <source src="../assets/production.mp4" />
        </video>
      </figure>
      <form
        class="flex flex-col px-3 lg:w-1/2 lg:content-center gap-3"
        @submit="handleSubmit"
        ref="loginForm"
      >
        <input
          data-test-id=""
          v-if="isNwUser"
          type="text"
          placeholder="Name"
          name="name"
          class="input input-bordered input-neutral w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          class="input input-bordered input-neutral w-full"
          required
        />
        <div class="flex gap-3">
          <input
            type="password"
            placeholder="Password"
            name="password"
            class="input input-bordered input-neutral w-full"
            required
          />

          <input
            v-if="isNwUser"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            class="input input-bordered input-neutral w-full"
            required
          />
        </div>

        <input
          type="submit"
          class="btn btn-primary w-full"
          :disabled="isLoading"
          :value="isNwUser ? 'SIGN UP' : 'SIGN IN'"
        />

        <div class="text-center" v-if="isLoading">
          <span class="loading loading-bars text-center m-3"></span>
        </div>
        <div class="text-end text-sm">
          <button
            class="link no-underline hover:underline"
            @click="isNwUser = !isNwUser"
            :disabled="isLoading"
            type="button"
          >
            {{
              !isNwUser
                ? "don't have an account yet ?"
                : "already have an account ?"
            }}
          </button>
        </div>
      </form>
    </div>
  </main>

  <Toast :message="errorMessage" icon="⚠️" />

  <dialog class="modal" ref="nwUserModal">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Welcome 🥳🥳🥳</h3>
      <p class="py-4">
        Your account has been created successfully! we hope you enjoy this beta!
      </p>
      <div class="modal-action">
        <button class="btn btn-primary" @click="handleNwUserModalClose">
          Log in
        </button>
      </div>
    </form>
  </dialog>
</template>
