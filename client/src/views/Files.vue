<script lang="ts" setup>
import { useFileDialog } from "@vueuse/core";
import axios from "axios";
import { onMounted, ref } from "vue";

const { open, reset, onChange } = useFileDialog();

const modal = ref<HTMLDialogElement | null>(null);

const file = ref<File | null>();
const files = ref([]);
const apiAdress = import.meta.env.VITE_API_ADDRES;

onMounted(() => {
  axios(apiAdress + "/files").then(res => {
    files.value = res.data;
  });
});

onChange(files => {
  file.value = files?.item(0);
  modal.value?.showModal();
});

const handleUploadFile = async (e: Event) => {
  e.preventDefault();

  const form = new FormData();
  form.append("name", file.value?.name!);
  form.append("file", file.value!);

  const post = await axios.post(apiAdress + "/files", form);
  if (post.status < 500) {
    modal.value?.close();
  }
  const get = await axios(apiAdress + "/files");

  files.value = get.data;
};
</script>

<template>
  <main class="p-3">
    <hgroup class="prose">
      <h2>Files</h2>
    </hgroup>
    <div class="divider"></div>
    <div class="tooltip" data-tip="add file">
      <button class="btn btn-circle mb-3" @click="open({ multiple: false })">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="table table-xs z-1">
        <!-- head -->
        <thead>
          <tr class="text-justify">
            <th>
              Name
              <label class="swap">
                <input type="checkbox" />
                <i class="fa-solid fa-arrow-down swap-on"></i>
                <i class="fa-solid fa-arrow-up swap-off"></i>
              </label>
            </th>
            <th>Created At</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody v-for="(file, index) in files">
          <!-- row 1 -->
          <tr class="hover text-justify">
            <td>{{ file.originalName }}</td>
            <td>{{ new Date(file.created_at).toLocaleString() }}</td>
            <td>
              <a :href="apiAdress + '/files/' + file.fileName" download>
                <i class="fa-solid fa-download"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <!-- modals -->
  <dialog class="modal modal-bottom lg:modal-middle" ref="modal">
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
      <form @submit="handleUploadFile" class="flex flex-col prose gap-3">
        <h3 class="font-bold text-lg">Are you sure ?</h3>
        <input
          type="text"
          class="input input-bordered w-full"
          :value="file?.name"
          readonly
        />
        <button class="btn btn-neutral">confirm</button>
      </form>
    </div>
  </dialog>
</template>
