<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import FileDialog from "./FileDialog.vue";
import DeleteFileDialog from "./DeleteDialog.vue";
import { File as MinimoldeFile } from "../../types";
import axios from "axios";
import { employee } from "../../stores/employeeStore";

//refs
const fileDialog = ref<InstanceType<typeof FileDialog>>();
const deleteFileDialog = ref<InstanceType<typeof DeleteFileDialog>>();
const isLoading = ref(false);

const files = ref<MinimoldeFile[]>([]);
const searchInput = ref("");

//functions
const downloadFile = (name: string) => {
  return import.meta.env.VITE_API_FILES_DOWNLOAD + name;
};

const fetchFiles = async () => {
  isLoading.value = true;
  const baseAdress =
    import.meta.env.VITE_API_ASSIGNED_FILES + employee.value._id;
  try {
    const res = await axios.get(baseAdress, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    isLoading.value = false;
    return res.data;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
    return [];
  }
};

//computations
const searchedFiles = computed(() =>
  [...files.value].filter(file =>
    file.originalName.toUpperCase().startsWith(searchInput.value.toUpperCase())
  )
);

//lifecycle

onMounted(async () => {
  const res = await fetchFiles();
  files.value = res;
});
</script>

<template>
  <header>
    <button class="btn btn-primary" @click="fileDialog?.chooseFile()">
      upload a file
    </button>
  </header>
  <progress class="progress w-full" :value="isLoading ? '' : '100'"></progress>

  <main class="flex flex-col gap-3">
    <div class="join sm:self-end">
      <input
        type="text"
        placeholder="file name"
        class="input input-bordered input-primary w-full max-w-xs join-item"
        v-model="searchInput"
      />
      <button class="btn btn-primary join-item">search</button>
    </div>
    <div class="max-h-screen sm:overflow-clip hover:overflow">
      <table class="table table-xs sm:table-md">
        <!-- head -->
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <template v-for="file in searchedFiles">
            <tr class="hover:bg-base-200">
              <td>
                <progress
                  v-if="file.status === 'completed'"
                  class="progress progress-success"
                  value="100"
                  max="100"
                ></progress>
                <progress
                  v-if="file.status === 'failed'"
                  class="progress progress-error"
                  value="100"
                  max="100"
                ></progress>
                <progress
                  v-if="file.status === 'uploading'"
                  class="progress progress-error"
                  value="100"
                  max="100"
                ></progress>
              </td>
              <td>{{ file.originalName }}</td>
              <td class="flex gap-3">
                <a
                  :href="downloadFile(file.name)"
                  class="btn btn-ghost btn-xs"
                  download
                >
                  <i class="fa-solid fa-download"></i>
                </a>

                <button
                  class="btn btn-ghost btn-xs"
                  @click="deleteFileDialog?.deleteFile(file)"
                >
                  <i class="fa-solid fa-trash text-error"></i>
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </main>

  <FileDialog
    ref="fileDialog"
    @file:sending="isLoading = true"
    @file:sent="
      async () => {
        files = await fetchFiles();
        isLoading = false;
      }
    "
  />

  <DeleteFileDialog
    ref="deleteFileDialog"
    @file:deleted="async () => (files = await fetchFiles())"
  />

  <!-- modals -->
</template>
