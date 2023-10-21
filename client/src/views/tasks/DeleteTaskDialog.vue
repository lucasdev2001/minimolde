<script setup lang="ts">
import { ref } from "vue";
import { Task } from "../../types";
import axios from "axios";
import handleApiResponseMessage from "../../utils/handleApiResponseMessage";

//emits
const emit = defineEmits(["task:delete"]);

const taskRef = ref<Task>();
const deleteDialog = ref<HTMLDialogElement>();

const toggleDialog = () => {
  if (deleteDialog.value?.open) {
    deleteDialog.value.close();
  } else {
    deleteDialog.value?.showModal();
  }
};

const defineTask = (task: Task) => {
  taskRef.value = task;
  toggleDialog();
};

const handleDeleteFile = async () => {
  try {
    const res = await axios.delete(
      import.meta.env.VITE_API_TASKS + taskRef.value?._id
    );
    emit("task:delete");
    toggleDialog();
    handleApiResponseMessage(res.data, true);
  } catch (error) {
    toggleDialog();
    handleApiResponseMessage((error as Error).message, false);
  }
};

//exposes

defineExpose({
  deleteTask: defineTask, // 🤫
});
</script>
<template>
  <dialog class="modal modal-middle lg:modal-middle" ref="deleteDialog">
    <div class="modal-box flex flex-col gap-3 prose">
      <form method="dialog">
        <i class="fa-solid fa-check-to-slot"></i>
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
          Are you sure ? deleting task:
          <span class="decoration-1 underline">
            {{ taskRef?.title }}
          </span>
        </h3>
        <input
          type="text"
          class="input input-bordered w-full"
          :value="taskRef?.title"
          readonly
        />
        <button class="btn btn-error" type="submit">delete</button>
      </form>
    </div>
  </dialog>
</template>
<style></style>
