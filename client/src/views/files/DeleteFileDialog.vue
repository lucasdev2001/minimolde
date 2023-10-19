<script setup lang="ts">
import { ref } from "vue";
import { File as MinimoldeFile } from "../../types";
import axios from "axios";
import handleApiResponseMessage from "../../utils/handleApiResponseMessage";

const fileRef = ref<MinimoldeFile>();
const deleteDialog = ref<HTMLDialogElement>();

const toggleFileDialog = () => {
  if (deleteDialog.value?.open) {
    deleteDialog.value.close();
  } else {
    deleteDialog.value?.showModal();
  }
};

const defineFile = (file: MinimoldeFile) => {
  fileRef.value = file;
  toggleFileDialog();
};

const handleDeleteFile = async () => {
  console.log(import.meta.env.VITE_API_FILES);

  try {
    const res = await axios.delete(
      import.meta.env.VITE_API_FILES + fileRef.value?.name
    );
    toggleFileDialog();
    handleApiResponseMessage(res.data, true);
  } catch (error) {
    toggleFileDialog();
    handleApiResponseMessage((error as Error).message, false);
  }
};

defineExpose({
  deleteFile: defineFile, // 🤫
});
</script>
<template>
  <dialog class="modal modal-middle lg:modal-middle" ref="deleteDialog">
    <div class="modal-box flex flex-col gap-3 prose">
      <form method="dialog">
        <i class="fa-solid fa-box-archive text-lg"></i>
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
        <button class="btn btn-error" type="submit">delete</button>
      </form>
    </div>
  </dialog>
</template>
<style></style>
