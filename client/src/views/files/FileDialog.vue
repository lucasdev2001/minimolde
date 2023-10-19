<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import axios from "axios";
import { ref } from "vue";
import { employee } from "../../stores/employeeStore";

const { open, reset, onChange } = useFileDialog();

//emits

const emit = defineEmits(["file:sending", "file:sent"]);

//events
const fileDialog = ref<HTMLDialogElement | null>(null);
const file = ref<File | null>();
const customName = ref("");

//functions
onChange(files => {
  file.value = files?.item(0);
  customName.value = file.value?.name ?? "";
  fileDialog.value?.showModal();
});

const handleUploadFile = async (e: Event) => {
  e.preventDefault();

  const form = new FormData();
  form.append("name", file.value?.name!);
  form.append("file", file.value!);
  form.append("assignedTo", employee.value._id);
  console.log(employee.value._id);

  if (customName.value !== file.value?.name) {
    form.append("customName", customName.value);
  }
  fileDialog.value?.close();
  emit("file:sending");
  await axios.post(import.meta.env.VITE_API_FILES, form);
  emit("file:sent");
};

defineExpose({
  chooseFile: open,
});
</script>
<template>
  <dialog class="modal modal-bottom lg:modal-middle" ref="fileDialog">
    <div class="modal-box flex flex-col gap-3 prose">
      <form method="dialog">
        <i class="fa-solid fa-box-archive text-lg"></i>
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="reset()"
        >
          <i class="fa-solid fa-x"></i>
        </button>
      </form>
      <form
        @submit.prevent="handleUploadFile"
        class="flex flex-col prose gap-3"
      >
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
        <button class="btn btn-neutral">confirm</button>
      </form>
    </div>
  </dialog>
</template>
<style></style>
