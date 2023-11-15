<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import axios from "axios";
import { ref } from "vue";
import { employee } from "../../stores/employeeStore";
import handleResponseMessage from "../../utils/handleResponseMessage";

const { open, reset, onChange } = useFileDialog({
  reset: true,
  multiple: false,
});

//emits
const emit = defineEmits(["file:sending", "file:sent"]);

//events
const dialog = ref<HTMLDialogElement | null>(null);
const isLoading = ref(false);
const file = ref<File | null>();
const customName = ref("");

//functions
onChange(files => {
  file.value = files?.item(0);
  customName.value = file.value?.name ?? "";
  dialog.value?.showModal();
});

const handleUploadFile = async (e: Event) => {
  e.preventDefault();

  const form = new FormData();
  form.append("name", file.value?.name!);
  form.append("file", file.value!);
  form.append("assignedTo", employee.value._id);

  if (customName.value !== file.value?.name) {
    form.append("customName", customName.value);
  }
  try {
    isLoading.value = true;
    emit("file:sending");
    const res = await axios.post(import.meta.env.VITE_API_FILES, form, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    handleResponseMessage(res.data, true);
    emit("file:sent");
  } catch (error) {
    handleResponseMessage((error as Error).message, false);
  }
  dialog.value?.close();
  isLoading.value = false;
};

defineExpose({
  chooseFile: open,
});
</script>
<template>
  <dialog class="modal modal-bottom lg:modal-middle" ref="dialog">
    <div class="modal-box flex flex-col gap-3">
      <form method="dialog">
        <i class="fa-solid fa-box-archive text-lg"></i>
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="reset()"
        >
          <i class="fa-solid fa-x"></i>
        </button>
      </form>
      <form @submit.prevent="handleUploadFile" class="flex flex-col gap-3">
        <h3 class="font-bold text-lg">
          Are you sure ? uploading:
          <span class="decoration-1 underline">
            {{ file?.name }}
          </span>
        </h3>
        <input
          type="text"
          class="input input-bordered w-full"
          name="customName"
          v-model="customName"
        />
        <button class="btn btn-neutral" :disabled="isLoading">
          confirm
          <span
            class="loading loading-spinner loading-xs"
            v-if="isLoading"
          ></span>
        </button>
      </form>
    </div>
  </dialog>
</template>
