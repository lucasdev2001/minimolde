<script setup lang="ts">
import { ref } from "vue";
import { Task } from "../../types.js";
import axios from "axios";
import handleResponseMessage from "../../utils/handleResponseMessage.js";

//emits
const emit = defineEmits(["task:delete"]);

const taskRef = ref<Task>();
const deleteDialog = ref<HTMLDialogElement>();

const isLoading = ref(false);

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

const handleDelete = async () => {
  isLoading.value = true;
  try {
    const res = await axios.delete(
      import.meta.env.VITE_API_TASKS + taskRef.value?._id,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    emit("task:delete");
    toggleDialog();
    handleResponseMessage(res.data, true);
  } catch (error) {
    toggleDialog();
    handleResponseMessage((error as Error).message, false);
  }
  isLoading.value = false;
};

//exposes

defineExpose({
  deleteTask: defineTask, // 🤫
});
</script>
<template>
  <dialog class="modal modal-middle lg:modal-middle" ref="deleteDialog">
    <div class="modal-box flex flex-col gap-3">
      <form method="dialog">
        <i class="fa-solid fa-check-to-slot"></i>
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
