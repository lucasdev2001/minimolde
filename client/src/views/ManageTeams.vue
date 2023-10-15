<script setup lang="ts">
import { onMounted, ref } from "vue";
import CreateTeamDialog from "../components/teams/CreateTeamDialog.vue";
import { employee } from "../stores/employeeStore";
const createTeamDialog = ref<InstanceType<typeof CreateTeamDialog> | null>(
  null
);
const isLoading = ref(false);
</script>
<template>
  <header class="flex flex-row justify-between">
    <hgroup class="prose font-thin">
      <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
      <h2 class="font-thin m-0">Manage your teams</h2>
    </hgroup>
  </header>
  <div class="divider"></div>

  <main class="flex flex-col gap-3 h-full">
    <button
      class="btn btn-primary"
      @click="createTeamDialog?.toggleCreateTeamDialog()"
    >
      create team
      <span class="loading loading-spinner" v-if="isLoading"></span>
    </button>
    <table class="table table-sm">
      <!-- head -->
      <thead>
        <tr>
          <th>Team name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr class="bg-base-200">
          <td>Cy Ganderton</td>

          <td class="flex gap-1">
            <button class="btn btn-ghost btn-xs">
              <i class="fa-solid fa-circle-info fa-lg"></i>
            </button>

            <button class="btn btn-ghost btn-xs">
              <i class="fa-solid fa-pen-to-square fa-lg"></i>
            </button>
            <button class="btn btn-ghost btn-xs">
              <i class="fa-solid fa-trash fa-lg"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>

  <!-- off-canvas -->

  <CreateTeamDialog
    @is-loading:true="isLoading = true"
    @is-loading:false="isLoading = false"
    ref="createTeamDialog"
  />
</template>
