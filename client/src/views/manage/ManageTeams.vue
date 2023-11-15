<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TeamDialog from "./TeamDialog.vue";
import { employee } from "../../stores/employeeStore";
import { Team } from "../../types";
import axios from "axios";
import AvatarGroup from "../employees/AvatarGroup.vue";
import DeleteTeamDialog from "./DeleteDialog.vue";
import { useRouter } from "vue-router";

//components refs
const teamDialog = ref<InstanceType<typeof TeamDialog>>();
const deleteTeamDialog = ref<InstanceType<typeof DeleteTeamDialog>>();

//refs
const isLoading = ref(true);

const teams = ref<Team[]>([]);

const searchInput = ref("");

const router = useRouter();

//functions

const fetchTeams = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(import.meta.env.VITE_API_TEAM, {
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

const searchedTeams = computed(() =>
  teams.value.filter(team =>
    team.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
  )
);

//lifecycles

onMounted(async () => {
  isLoading.value = true;
  teams.value = await fetchTeams();

  isLoading.value = false;
});
</script>
<template>
  <header class="flex flex-row justify-between">
    <hgroup>
      <h1 class="text-3xl">Hi {{ employee.name }} 👋</h1>
      <h2>Manage your teams</h2>
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
    <div class="pb-32 sm:overflow-clip hover:overflow-auto max-h-screen">
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
                      name: 'teams',
                      params: {
                        team: team.name,
                      },
                    })
                  "
                >
                  <i class="fa-solid fa-circle-info fa-lg"></i>
                </button>

                <button
                  class="btn btn-ghost btn-xs"
                  @click="teamDialog?.updateTeam(team)"
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
    @team:created="async () => (teams = await fetchTeams())"
    @team:updated="async () => (teams = await fetchTeams())"
    ref="teamDialog"
  />
  <DeleteTeamDialog
    ref="deleteTeamDialog"
    @team:delete="async () => (teams = await fetchTeams())"
  />
</template>
