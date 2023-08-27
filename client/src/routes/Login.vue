<script lang="ts" setup>
import axios, { AxiosError } from "axios";
import { ref } from "vue";

const loginForm = ref({});
const isNwUser = ref(false);
const isLoading = ref(false);
const errorMessage = ref<null | string>(null);
// const successMessage = ref<null | string>(null);
const nwUserModal = ref<HTMLDialogElement>();

const handleerrorMessage = (message: string) => {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = null;
  }, 3000);
};

// const handleSuccessMessage = (message: string) => {
//   successMessage.value = message;
//   setTimeout(() => {
//     successMessage.value = null;
//   }, 3000);
// };

const handleSubmit = (event: Event) => {
  event.preventDefault();
  const formData = new FormData(loginForm.value as HTMLFormElement);
  const employee = Object.fromEntries(formData.entries());

  if (isNwUser.value && employee.password !== employee.confirmPassword) {
    const message = "passwords dosen't match";
    handleerrorMessage(message);

    throw (new Error().message = message);
  }

  const path = isNwUser.value ? "/employees/" : "/employees/auth";
  isLoading.value = true;
  axios
    .post(import.meta.env.VITE_API_ADDRES + path, employee)
    .then(res => {
      // handleSuccessMessage(isNwUser.value ? "Succesfully created" : "Welcome");
      if (!isNwUser.value) {
        localStorage.setItem("token", res.data);
      } else {
        (nwUserModal.value as HTMLDialogElement).showModal();
      }
    })
    .catch((err: AxiosError) => {
      handleerrorMessage((err.response?.data as string) ?? err.message);
    })
    .finally(() => (isLoading.value = false));
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
        class="grid px-3 lg:w-1/2 lg:content-center gap-3"
        @submit="handleSubmit"
        ref="loginForm"
      >
        <input
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
        <div class="text-end text-sm" v-if="!isNwUser">
          <button
            class="link no-underline hover:underline"
            :disabled="isLoading"
            type="button"
          >
            forgot your password ?
          </button>
        </div>
      </form>
    </div>
  </main>

  <div
    class="toast toast-top toast-center max-h-60 lg:max-h-none"
    v-if="errorMessage"
  >
    <label for="sign">
      <div>
        <div class="alert shadow-lg rounded-full text-xs lg:text-lg">
          ⚠️{{ errorMessage }}
        </div>
        <br />
      </div>
    </label>
  </div>
  <!-- <div
    class="toast toast-top toast-center max-h-60 lg:max-h-none"
    v-if="successMessage"
  >
    <label for="sign">
      <div>
        <div class="alert shadow-lg rounded-full text-xs lg:text-lg">
          ✅ {{ successMessage }}
        </div>
        <br />
      </div>
    </label>
  </div> -->

  <dialog class="modal" ref="nwUserModal">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Welcome 🥳🥳🥳</h3>
      <p class="py-4">
        Your account has been created successfully! we hope you enjoy this beta!
      </p>
      <div class="modal-action">
        <button
          class="btn btn-primary"
          @click="
            () => {
              isNwUser = !isNwUser;
              nwUserModal?.close();
            }
          "
        >
          Log in
        </button>
      </div>
    </form>
  </dialog>
</template>
