<script lang="ts" setup>
import { useFileDialog } from "@vueuse/core";
import axios from "axios";
import { ref } from "vue";

const { open, reset, onChange } = useFileDialog();

const modal = ref<HTMLDialogElement | null>(null);

const file = ref<File | null>();

onChange(files => {
  file.value = files?.item(0);
  modal.value?.showModal();
});

const handleUploadFile = async (e: Event) => {
  e.preventDefault();

  const form = new FormData();
  form.append("name", file.value?.name!);
  form.append("file", file.value!);

  const res = await axios
    .post(import.meta.env.VITE_API_ADDRES + "/files", form)
    .catch(err => err);
  console.log(res);
};
</script>

<template>
  <main class="container mx-auto p-3">
    <div class="tooltip" data-tip="add file">
      <button
        class="btn btn-circle mb-3"
        @click="open({ multiple: false, accept: '.JPG' })"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr class="bg-base-200">
            <th>1</th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <th>2</th>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          <!-- row 3 -->
          <tr>
            <th>3</th>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <!-- modals -->
  <dialog class="modal modal-bottom lg:modal-middle" ref="modal">
    <div class="modal-box flex flex-col gap-3 prose">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="reset()"
        >
          ✕
        </button>
      </form>
      <form @submit="handleUploadFile" class="flex flex-col">
        <h3 class="font-bold text-lg">Are you sure ?</h3>
        <input
          type="text"
          class="input input-bordered w-full"
          :value="file?.name"
          readonly
        />
        <button class="btn btn-neutral mt-3">confirm</button>
      </form>
    </div>
  </dialog>
</template>
