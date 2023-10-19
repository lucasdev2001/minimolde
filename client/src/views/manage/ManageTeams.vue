<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import CreateTeamDialog from "./TeamDialog.vue";
import { employee } from "../../stores/employeeStore";
import { Team } from "../../types";
import axios from "axios";

//lifecycles

onMounted(async () => {
  isLoading.value = true;
  teamsWithPaging.value = await fetchTeamsWithQuery(query.limit, query.page);
  console.log(teamsWithPaging.value.teams);

  isLoading.value = false;
});

//components refs
const createTeamDialog = ref<InstanceType<typeof CreateTeamDialog> | null>(
  null
);

//refs
const isLoading = ref(true);

const teamsWithPaging = ref<{
  pages: number;
  teams: Team[];
  documentsCount: number;
}>({
  pages: 0,
  teams: [],
  documentsCount: 0,
});

const query = reactive<{
  name?: string;
  limit: number;
  page: number;
}>({
  limit: 6,
  page: 0,
  name: "",
});

//functions

const fetchTeamsWithQuery = async (
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
    .get(import.meta.env.VITE_API_TEAM + "?" + query.join("&"))
    .then(res => res.data)
    .catch(_ => []);
};

const handlePagination = async (pageNumber: number) => {
  query.page = pageNumber;
  teamsWithPaging.value = await fetchTeamsWithQuery(
    query.limit,
    query.page,
    query.name
  );
};
</script>
<template>
  <header class="flex flex-row justify-between">
    <hgroup class="prose font-thin">
      <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
      <h2 class="font-thin m-0">Manage your teams</h2>
    </hgroup>
    <button
      class="btn btn-primary self-end"
      @click="createTeamDialog?.toggleCreateTeamDialog()"
    >
      create team
    </button>
  </header>
  <progress class="progress w-full" :value="isLoading ? '' : '100'"></progress>

  <main class="flex flex-col gap-3 h-full">
    <div class="flex justify-end">
      <div class="join">
        <input
          id="search-employees"
          type="text"
          placeholder="Search teams"
          class="input input-bordered input-primary w-full grow join-item"
        />
        <button class="btn btn-neutral join-item hidden" type="button">
          <i class="fa-solid fa-x"></i>
        </button>
        <button class="btn btn-primary join-item" type="button">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>
    <table class="table table-sm">
      <!-- head -->
      <thead>
        <tr>
          <th>Team name</th>
          <th>Employees</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <template v-for="team in teamsWithPaging.teams">
          <tr class="hover:bg-base-200">
            <td>{{ team.name }}</td>
            <td>
              <div class="avatar-group -space-x-6">
                <div class="avatar placeholder">
                  <div class="w-12 bg-neutral-focus text-neutral-content">
                    <span>+20</span>
                  </div>
                </div>
              </div>
            </td>

            <td class="flex gap-1">
              <button class="btn btn-ghost btn-xs">
                <i class="fa-solid fa-circle-info fa-lg"></i>
              </button>

              <button
                class="btn btn-ghost btn-xs"
                @click="createTeamDialog?.toggleCreateTeamDialog()"
              >
                <i class="fa-solid fa-pen-to-square fa-lg"></i>
              </button>
              <button class="btn btn-ghost btn-xs">
                <i class="fa-solid fa-trash fa-lg text-error"></i>
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="join justify-end pb-10">
      <template v-for="(_, index) in teamsWithPaging.pages">
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
  </main>

  <CreateTeamDialog
    @is-loading:true="isLoading = true"
    @is-loading:false="isLoading = false"
    ref="createTeamDialog"
  />
</template>
