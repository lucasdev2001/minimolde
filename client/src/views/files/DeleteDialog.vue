<script setup lang="ts">
import { ref } from "vue";
import { File as MinimoldeFile } from "../../types.js";
import axios from "axios";
import handleResponseMessage from "../../utils/handleResponseMessage.js";

const emit = defineEmits([`file:deleted`]);

const fileRef = ref<MinimoldeFile>({
  originalName: "",
  assignedTo: "",
  created_at: new Date(Date.now()).getFullYear(),
  employee: "",
  name: "",
  status: "uploading",
});
const deleteDialog = ref<HTMLDialogElement>();

const isLoading = ref(false);

const toggleFileDialog = () => {
  if (deleteDialog.value?.open) {
    deleteDialog.value.close();
  } else {
    deleteDialog.value?.showModal();
  }
};

const prepareDelete = (file: MinimoldeFile) => {
  fileRef.value = file;
  toggleFileDialog();
};

const handleDeleteFile = async () => {
  isLoading.value = true;

  try {
    const res = await axios.delete(
      import.meta.env.VITE_API_FILES + fileRef.value?.name,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    emit(`file:deleted`);
    toggleFileDialog();
    handleResponseMessage(res.data, true);
  } catch (error) {
    toggleFileDialog();
    handleResponseMessage((error as Error).message, false);
  }
  isLoading.value = false;
};

defineExpose({
  deleteFile: prepareDelete, // 🤫
});
</script>
<template>
  <dialog class="modal modal-middle lg:modal-middle" ref="deleteDialog">
    <div class="modal-box flex flex-col gap-3">
      <form method="dialog">
        <i class="fa-solid fa-box-archive text-lg"></i>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          <i class="fa-solid fa-x"></i>
        </button>
      </form>
      <form
        class="flex flex-col gap-3"
        method="post"
        @submit.prevent="handleDeleteFile"
      >
        <h3 class="font-bold text-lg">
          Are you sure ? deleting:
          <span class="decoration-1 underline">
            {{ fileRef?.originalName }}
          </span>
        </h3>
        <input
          type="text"
          class="input input-bordered w-full"
          :value="fileRef?.originalName"
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
