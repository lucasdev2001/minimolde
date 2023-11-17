<script setup lang="ts">
import { onMounted, ref } from "vue";
import { employee } from "../../stores/employeeStore";
import { Notification } from "../../types";
import axios from "axios";
import handleResponseMessage from "../../utils/handleResponseMessage";
import { client } from "../../microservices/broker";

const isLoading = ref(false);

const notifications = ref<Notification[]>([]);
const dialog = ref<HTMLDialogElement>();

const fetchNotifications = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(import.meta.env.VITE_API_NOTIFICATIONS, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    isLoading.value = false;

    return res.data;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

const handleNotification = async () => {
  const notification = {
    content: notificationMessage.value,
    from: employee.value._id,
  };
  isLoading.value = true;
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_NOTIFICATIONS,
      notification,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    toggleDialog();
    handleResponseMessage(res.data, true);
  } catch (error) {
    toggleDialog();
    handleResponseMessage((error as Error).message, false);
  }
  isLoading.value = false;
};

const toggleDialog = async () => {
  if (dialog.value?.open) {
    dialog.value?.close();
  } else {
    dialog.value?.showModal();
  }
};

onMounted(async () => {
  notifications.value = await fetchNotifications();
});
client.on("message", async topic => {
  if (topic === "notifications") {
    notifications.value = await fetchNotifications();
  }
});
const notificationMessage = ref("");
</script>
<template>
  <header class="flex flex-row justify-between">
    <hgroup>
      <h1 class="text-3xl">Hi {{ employee.name }} 👋</h1>
      <h2>Here is your inbox</h2>
    </hgroup>
    <button class="btn btn-primary self-end" @click="toggleDialog()">
      create a message
    </button>
  </header>
  <progress class="progress w-full" :value="isLoading ? '' : '100'"></progress>

  <main class="flex flex-col gap-3 h-full">
    <div class="max-h-fit pb-10 overflow-y-auto">
      <template v-for="notification in notifications">
        <div
          class="chat"
          :class="
            notification.from._id === employee._id ? 'chat-end' : 'chat-start'
          "
        >
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img :src="notification.from.profilePicture" />
            </div>
          </div>
          <div class="chat-header">
            {{ notification.from.name }}
            <time class="text-xs opacity-50">{{
              new Date(notification.created_at).toLocaleTimeString()
            }}</time>
          </div>
          <div class="chat-bubble">{{ notification.content }}</div>
        </div>
      </template>
    </div>
  </main>

  <dialog class="modal modal-bottom sm:modal-middle" ref="dialog">
    <form
      method="post"
      class="modal-box form-control gap-3"
      @submit.prevent="handleNotification"
    >
      <h3 class="font-bold text-lg">What we should now ?</h3>
      <textarea
        class="textarea textarea-primary"
        placeholder="ex: there has been an accident on floor nº3"
        v-model="notificationMessage"
        required
      ></textarea>
      <div class="modal-action">
        <button class="btn" type="button" @click="toggleDialog()">Close</button>
        <button class="btn btn-primary" :disabled="isLoading">
          send
          <span
            class="loading loading-spinner loading-xs"
            v-if="isLoading"
          ></span>
        </button>
      </div>
    </form>
  </dialog>
</template>
