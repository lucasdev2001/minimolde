<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { employee } from "../../stores/employeeStore";
import handleResponseMessage from "../../utils/handleResponseMessage";
import { useObjectUrl } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();

const { open, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false,
  reset: true,
});
const rawProfile = {
  name: "",
  email: "",
  password: null,
  newPassword: null,
};
const proxyProfile = reactive<{
  name: string;
  email: string;
  password: string | null;
  newPassword: string | null;
}>({
  name: "",
  email: "",
  password: null,
  newPassword: null,
});

const isLoading = ref(false);
const fetchProfile = async () => {
  const res = await axios(
    import.meta.env.VITE_API_EMPLOYEE + employee.value._id,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  return res.data;
};

const dialog = ref<HTMLDialogElement>();
const toggleDialog = () => {
  (proxyProfile.email = employee.value.email),
    (proxyProfile.name = employee.value.name);

  changePassword.value = false;
  if (dialog.value?.open) {
    dialog.value.close();
  } else {
    dialog.value?.showModal();
  }
};

const file = ref<File | null | undefined>();
const url = useObjectUrl(file);
const changePassword = ref(false);

//functions
onChange(async files => {
  file.value = files?.item(0);
});

const handleUploadFile = async (e: Event) => {
  e.preventDefault();
  if (file.value) {
    const form = new FormData();
    form.append("name", file.value?.name!);
    form.append("file", file.value!);
    form.append("employeeId", employee.value._id);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_FILES_PROFILE,
        form,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      handleResponseMessage(res.data, true);

      employee.value = await fetchProfile();
    } catch (error) {
      handleResponseMessage((error as Error).message, false);
    }
  }

  file.value = null;
};

const handleProfileUpdate = async () => {
  try {
    const res = await axios.put(
      import.meta.env.VITE_API_AUTH + employee.value._id,
      proxyProfile,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    handleResponseMessage(res.data, true);
    if (proxyProfile.email !== employee.value.email) {
      localStorage.clear();
      router.push({ name: "Auth" });
    } else {
      employee.value = await fetchProfile();
    }
  } catch (error) {
    handleResponseMessage((error as Error).message, false);
  }
  toggleDialog();
};

onMounted(() => {
  dialog.value?.addEventListener("cancel", () => {
    Object.assign(proxyProfile, rawProfile);
  });
});
</script>

<template>
  <div class="dropdown">
    <label tabindex="0">
      <div class="flex items-center space-x-3">
        <div class="avatar">
          <div
            class="w-14 rounded-full hover:ring-4 ring-base-200 hover:cursor-pointer"
          >
            <img :src="employee.profilePicture" />
          </div>
        </div>
        <div>
          <div class="font-bold">{{ employee.name }}</div>
          <div class="text-sm opacity-50">{{ employee.email }}</div>
        </div>
      </div>
    </label>
    <ul
      tabindex="0"
      class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li @click="toggleDialog()"><a>Profile</a></li>

      <slot name="profile-actions"> </slot>
    </ul>
  </div>

  <dialog class="modal modal-bottom sm:modal-middle" ref="dialog">
    <div class="modal-box flex flex-col">
      <form class="flex justify-center" @submit.prevent="handleUploadFile">
        <div class="avatar">
          <div
            class="w-24 rounded-full hover:ring-4 ring-base-200 hover:cursor-pointer"
            @click="open()"
          >
            <img :src="url ?? employee.profilePicture" />
          </div>
        </div>
        <button
          class="btn btn-ghost btn-circle"
          @click="open()"
          type="button"
          v-if="!file"
          :disabled="isLoading"
        >
          <i class="fa-solid fa-pen-to-square" v-if="!isLoading"></i>
          <span
            class="loading loading-spinner loading-xs"
            v-if="isLoading"
          ></span>
        </button>
        <button
          class="btn btn-ghost btn-circle"
          @click="handleUploadFile"
          type="submit"
          v-if="file"
        >
          <i class="fa-solid fa-upload"></i>
        </button>
      </form>
      <form @submit.prevent="handleProfileUpdate" class="flex flex-col gap-3">
        <label for="name" class="label-text"
          >Name
          <input
            name="name"
            type="text"
            class="input input-bordered input-primary w-full"
            required
            v-model="proxyProfile.name"
          />
        </label>
        <label for="email" class="label-text"
          >Email
          <input
            name="email"
            type="email"
            class="input input-bordered input-primary w-full"
            required
            v-model="proxyProfile.email"
          />
        </label>

        <div class="flex justify-between" v-if="changePassword">
          <div>
            <input
              placeholder="password"
              name="password"
              type="password"
              class="input input-bordered input-primary"
              required
              v-model="proxyProfile.password"
            />
          </div>
          <div class="self-end">
            <input
              placeholder="New Password"
              name="password"
              type="password"
              class="input input-bordered input-primary"
              required
              v-model="proxyProfile.newPassword"
            />
          </div>
        </div>

        <button
          class="btn btn-primary"
          v-if="!changePassword"
          @click="changePassword = !changePassword"
          type="button"
        >
          change password
        </button>
        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="toggleDialog()" type="button">
            cancel
          </button>
          <button class="btn btn-primary" type="submit">save</button>
        </div>
      </form>
    </div>
  </dialog>
</template>
