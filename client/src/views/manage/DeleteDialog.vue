<script setup lang="ts">
import { ref } from "vue";
import { Team } from "../../types.js";
import axios from "axios";
import handleResponseMessage from "../../utils/handleResponseMessage.js";

//emits
const emit = defineEmits(["team:delete"]);

const teamRef = ref<Team>();
const dialog = ref<HTMLDialogElement>();
const isLoading = ref(false);

const toggleFileDialog = () => {
  if (dialog.value?.open) {
    dialog.value.close();
  } else {
    dialog.value?.showModal();
  }
};

const defineTeam = (file: Team) => {
  teamRef.value = file;
  toggleFileDialog();
};

const handleDelete = async () => {
  isLoading.value = true;
  try {
    const res = await axios.delete(
      import.meta.env.VITE_API_TEAM + teamRef.value?._id,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    emit("team:delete");
    toggleFileDialog();
    handleResponseMessage(res.data, true);
  } catch (error) {
    toggleFileDialog();
    handleResponseMessage((error as Error).message, false);
  }
  isLoading.value = false;
};

//exposes

defineExpose({
  deleteTeam: defineTeam, // 🤫
});
</script>
<template>
  <dialog class="modal modal-middle lg:modal-middle" ref="dialog">
    <div class="modal-box flex flex-col gap-3">
      <form method="dialog">
        <i class="fa-solid fa-user-group ms-auto"></i>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          <i class="fa-solid fa-x"></i>
        </button>
      </form>
      <form
        class="flex flex-col gap-3"
        method="post"
        @submit.prevent="handleDelete"
      >
        <h3 class="font-bold text-lg">
          Are you sure ? deleting team:
          <span class="decoration-1 underline">
            {{ teamRef?.name }}
          </span>
        </h3>
        <input
          type="text"
          class="input input-bordered w-full"
          :value="teamRef?.name"
          readonly
        />
        <button class="btn btn-error" type="submit" :disabled="isLoading">
          delete
          <span
            class="loading loading-spinner loading-xs"
            v-if="isLoading"
          ></span>
        </button>
      </form>
    </div>
  </dialog>
</template>
