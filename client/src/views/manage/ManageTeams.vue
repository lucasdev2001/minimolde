<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TeamDialog from "./TeamDialog.vue";
import { employee } from "../../stores/employeeStore";
import { Team } from "../../types";
import axios from "axios";
import AvatarGroup from "../employees/AvatarGroup.vue";
import DeleteTeamDialog from "./DeleteTeamDialog.vue";
import { useRouter } from "vue-router";

//lifecycles

onMounted(async () => {
  isLoading.value = true;
  teams.value = await fetchTeamsWithQuery();

  isLoading.value = false;
});

//components refs
const teamDialog = ref<InstanceType<typeof TeamDialog>>();
const deleteTeamDialog = ref<InstanceType<typeof DeleteTeamDialog>>();

//refs
const isLoading = ref(true);

const teams = ref<Team[]>([]);

const searchInput = ref("");

const router = useRouter();

//functions

const fetchTeamsWithQuery = async (name: string | null = null) => {
  const nameQuery = "name=" + name;

  const query = [];
  if (name && name !== "") query.push(nameQuery);

  return axios
    .get(import.meta.env.VITE_API_TEAM)
    .then(res => res.data)
    .catch(_ => []);
};

const searchedTeams = computed(() => {
  if (searchInput.value !== "") {
    return teams.value.filter(team =>
      team.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
    );
  }
  return teams.value;
});
</script>
<template>
  <header class="flex flex-row justify-between">
    <hgroup class="prose font-thin">
      <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
      <h2 class="font-thin m-0">Manage your teams</h2>
    </hgroup>
    <button
      class="btn btn-primary self-end"
      @click="teamDialog?.toggleCreateTeamDialog()"
    >
      create team
    </button>
  </header>
  <progress class="progress w-full" :value="isLoading ? '' : '100'"></progress>

  <main class="flex flex-col gap-3 h-full">
    <div class="join sm:self-end">
      <input
        type="text"
        class="input input-bordered input-primary w-full max-w-xs join-item"
        placeholder="Search team"
        v-model="searchInput"
      />
      <button class="btn btn-primary join-item pointer-events-none">
        search
      </button>
    </div>
    <div class="overflow-y-auto pb-32">
      <table class="table table-xs">
        <!-- head -->
        <thead>
          <tr>
            <th>Team name</th>
            <th class="hidden sm:flex">Employees</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <template v-for="team in searchedTeams">
            <tr class="hover:bg-base-200">
              <td>{{ team.name }}</td>
              <td class="hidden sm:flex">
                <div class="avatar-group -space-x-6">
                  <AvatarGroup :employees="team.employees" />
                </div>
              </td>
              <td>{{ team.description }}</td>

              <td class="flex">
                <button
                  class="btn btn-ghost btn-xs"
                  @click="
                    router.push({
                      name: `teams`,
                      path: 'teams',
                      params: {
                        team: team._id,
                      },
                    })
                  "
                >
                  <i class="fa-solid fa-circle-info fa-lg"></i>
                </button>

                <button
                  class="btn btn-ghost btn-xs"
                  @click="teamDialog?.editTeam(team)"
                >
                  <i class="fa-solid fa-pen-to-square fa-lg"></i>
                </button>
                <button
                  class="btn btn-ghost btn-xs"
                  @click="deleteTeamDialog?.deleteTeam(team)"
                >
                  <i class="fa-solid fa-trash fa-lg text-error"></i>
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </main>

  <TeamDialog
    @is-loading:true="isLoading = true"
    @is-loading:false="isLoading = false"
    @team:created="async () => (teams = await fetchTeamsWithQuery())"
    @team:updated="async () => (teams = await fetchTeamsWithQuery())"
    ref="teamDialog"
  />
  <DeleteTeamDialog
    ref="deleteTeamDialog"
    @team:delete="async () => (teams = await fetchTeamsWithQuery())"
  />
</template>
