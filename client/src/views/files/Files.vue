<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import FileDialog from "./FileDialog.vue";
import DeleteFileDialog from "./DeleteFileDialog.vue";
import { File as MinimoldeFile } from "../../types";
import axios from "axios";
import { employee } from "../../stores/employeeStore";
const fileDialog = ref<InstanceType<typeof FileDialog>>();
const deleteFileDialog = ref<InstanceType<typeof DeleteFileDialog>>();

const filesWithPaging = ref<{
  files: MinimoldeFile[];
  pages: number;
}>({
  files: [],
  pages: 0,
});

const query = reactive<{
  name?: string;
  limit: number;
  page: number;
}>({
  limit: 4,
  page: 0,
  name: "",
});

const fetchFilesWithQuery = async (
  limit: number,
  page: number,
  name: string | null = null
) => {
  const baseAdress =
    import.meta.env.VITE_API_ASSIGNED_FILES + employee.value._id;
  console.log(baseAdress);

  const pageQuery = "page=" + page;
  const limitQuery = "limit=" + limit;
  const nameQuery = "name=" + name;

  const query = [pageQuery, limitQuery];
  if (name && name !== "") query.push(nameQuery);

  return axios
    .get(baseAdress + "?" + query.join("&"))
    .then(res => res.data)
    .catch(_ => []);
};

onMounted(async () => {
  const res = await fetchFilesWithQuery(query.limit, query.page);
  filesWithPaging.value = res;
  console.log(filesWithPaging.value.files);
});
</script>

<template>
  <header>
    <button class="btn btn-primary" @click="fileDialog?.chooseFile()">
      upload a file
    </button>
  </header>
  <progress class="progress w-full" value="100"></progress>

  <main class="flex flex-col gap-3">
    <div class="join sm:self-end">
      <input
        type="text"
        placeholder="file name"
        class="input input-bordered input-primary w-full max-w-xs join-item"
      />
      <button class="btn btn-primary join-item">search</button>
    </div>
    <div class="overflow-x-auto">
      <table class="table table-xs sm:table-md">
        <!-- head -->
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <template v-for="file in filesWithPaging.files">
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
              <td>{{ new Date(file.created_at).toLocaleDateString() }}</td>
              <td class="flex gap-3">
                <button class="btn btn-ghost btn-xs">
                  <i class="fa-solid fa-download"></i>
                </button>

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
    <div class="join">
      <button class="join-item btn">1</button>
    </div>
  </main>

  <FileDialog
    ref="fileDialog"
    @file:sent="
      async () => {
        filesWithPaging = await fetchFilesWithQuery(query.limit, query.page);
      }
    "
  />

  <DeleteFileDialog ref="deleteFileDialog" />

  <!-- modals -->
</template>
