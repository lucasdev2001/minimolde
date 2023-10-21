<script setup lang="ts">
import { ref } from "vue";
import { Team } from "../../types";
import axios from "axios";
import handleApiResponseMessage from "../../utils/handleApiResponseMessage";

//emits
const emit = defineEmits(["team:delete"]);

const teamRef = ref<Team>();
const deleteDialog = ref<HTMLDialogElement>();

const toggleFileDialog = () => {
  if (deleteDialog.value?.open) {
    deleteDialog.value.close();
  } else {
    deleteDialog.value?.showModal();
  }
};

const defineTeam = (file: Team) => {
  teamRef.value = file;
  toggleFileDialog();
};

const handleDeleteFile = async () => {
  try {
    const res = await axios.delete(
      import.meta.env.VITE_API_TEAM + teamRef.value?._id
    );
    emit("team:delete");
    toggleFileDialog();
    handleApiResponseMessage(res.data, true);
  } catch (error) {
    toggleFileDialog();
    handleApiResponseMessage((error as Error).message, false);
  }
};

//exposes

defineExpose({
  deleteTeam: defineTeam, // 🤫
});
</script>
<template>
  <dialog class="modal modal-middle lg:modal-middle" ref="deleteDialog">
    <div class="modal-box flex flex-col gap-3 prose">
      <form method="dialog">
        <i class="fa-solid fa-user-group ms-auto"></i>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          <i class="fa-solid fa-x"></i>
        </button>
      </form>
      <form
        class="flex flex-col prose gap-3"
        method="post"
        @submit.prevent="handleDeleteFile"
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
        <button class="btn btn-error" type="submit">delete</button>
      </form>
    </div>
  </dialog>
</template>
<style></style>
