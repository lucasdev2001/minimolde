<script setup lang="ts">
import { reactive, ref } from "vue";
import { Employee } from "../../types";
import axios from "axios";
import AvatarGroup from "../employees/AvatarGroup.vue";
//emits

const emit = defineEmits(["isLoading:true", "isLoading:false"]);

//refs
const employeesWithPaging = ref<{
  employees: Employee[];
  pages: number;
  documentsCount: number;
}>({
  employees: [],
  pages: 0,
  documentsCount: 0,
});
const createTeamDialog = ref<HTMLDialogElement | null>(null);
const checkedEmployees = ref([]);
const query = reactive<{
  name?: string;
  limit: number;
  page: number;
}>({
  limit: 4,
  page: 0,
  name: "",
});

//functions
const toggleCreateTeamDialog = async () => {
  if (createTeamDialog.value?.open) {
    createTeamDialog.value?.close();
  } else {
    emit("isLoading:true");
    employeesWithPaging.value = await fetchEmployeesWithQuery(
      query.limit,
      query.page
    );
    emit("isLoading:false");
    createTeamDialog.value?.showModal();
  }
};
const fetchEmployeesWithQuery = async (
  limit: number,
  page: number,
  name: string | null = null
) => {
  const pageQuery = "page=" + page;
  const limitQuery = "limit=" + limit;
  const nameQuery = "name=" + name;

  const query = [pageQuery, limitQuery];
  if (name && name !== "") query.push(nameQuery);

  return axios
    .get(import.meta.env.VITE_API_ADDRES_FIND_EMPLOYEE + "?" + query.join("&"))
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(_ => []);
};
const handleCreateTeam = async (event: Event) => {
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());
  console.log(formJson);
  console.log(checkedEmployees.value);
};

const handlePagination = async (pageNumber: number) => {
  query.page = pageNumber;
  employeesWithPaging.value = await fetchEmployeesWithQuery(
    query.limit,
    query.page,
    query.name
  );
};

const handleSearch = async () => {
  query.page = 0;
  employeesWithPaging.value = await fetchEmployeesWithQuery(
    query.limit,
    query.page,
    query.name
  );
};

//exposes

defineExpose({
  toggleCreateTeamDialog,
});
</script>
<template>
  <dialog class="modal modal-bottom sm:modal-middle" ref="createTeamDialog">
    <div class="modal-box">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="toggleCreateTeamDialog"
      >
        <i class="fa-solid fa-x"></i>
      </button>
      <div>
        <h3 class="font-bold text-lg">Create a new team</h3>
        <AvatarGroup />
      </div>

      <form
        method="post"
        class="form-control gap-1"
        @submit.prevent="handleCreateTeam"
      >
        <label for="team-name" class="label label-text">Team name</label>
        <input
          id="team-name"
          name="teamName"
          type="text"
          placeholder="ex: The lobsters of wall street"
          class="input input-bordered input-primary w-full"
          maxlength="30"
          required
        />

        <label for="team-description" class="label label-text">
          Team description
        </label>
        <textarea
          id="team-description"
          name="teamDescription"
          class="textarea textarea-primary w-full"
          placeholder="ex: finance department of building nº 3"
          maxlength="40"
          required
        ></textarea>
        <label for="search-employees" class="label label-text"
          >Total Employees: {{ employeesWithPaging.documentsCount }}</label
        >
        <div class="join flex">
          <input
            id="search-employees"
            type="text"
            placeholder="Search employees"
            class="input input-bordered input-primary w-full grow join-item"
            v-model="query.name"
          />
          <button
            class="btn btn-neutral join-item"
            type="button"
            v-if="query.name"
            @click="
              () => {
                query.name = '';
                handleSearch();
              }
            "
          >
            ✕
          </button>
          <button
            class="btn btn-primary join-item"
            type="button"
            @click="handleSearch"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <div class="flex flex-col">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="employee in employeesWithPaging.employees">
                <tr>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        class="checkbox"
                        name="employees"
                        :value="employee._id"
                        v-model="checkedEmployees"
                      />
                    </label>
                  </th>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar">
                        <div class="mask mask-squircle w-12 h-12">
                          <img
                            :src="employee.profilePicture"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div class="font-bold">{{ employee.name }}</div>
                        <div class="text-sm opacity-50 truncate"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-ghost badge-sm">
                      <template v-for="role in employee.roles">
                        {{ role }}
                      </template>
                    </span>
                  </td>
                </tr></template
              >
            </tbody>
          </table>
          <div class="join justify-end">
            <template v-for="(_, index) in employeesWithPaging.pages">
              <button
                class="join-item btn"
                type="button"
                @click="handlePagination(index)"
                :class="query.page === index && 'btn-active'"
              >
                {{ index + 1 }}
              </button>
            </template>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn" type="submit">Close</button>
          <button class="btn btn-primary" type="submit">Create</button>
        </div>
      </form>
    </div>
  </dialog>
</template>
<style></style>
