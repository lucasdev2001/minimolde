<script setup lang="ts">
import { computed, ref } from "vue";
import { Employee, Team } from "../../types";
import axios, { AxiosError } from "axios";
import handleResponseMessage from "../../utils/handleResponseMessage";

//emits

const emit = defineEmits([
  "isLoading:true",
  "isLoading:false",
  "team:created",
  "team:updated",
]);

//refs
const updatedTeam = ref<Team | null>();
const employees = ref<Employee[]>([]);
const createTeamForm = ref<HTMLFormElement | null>(null);
const createTeamDialog = ref<HTMLDialogElement | null>(null);
const checkedEmployees = ref<string[]>([]);
const searchInput = ref("");
const isEditing = ref(false);

//functions
const defineEdit = (team: Team) => {
  isEditing.value = true;
  updatedTeam.value = team;
  checkedEmployees.value = updatedTeam.value.employees.map(
    employee => employee._id
  );
  toggleDialog();
};
const toggleDialog = async () => {
  if (createTeamDialog.value?.open) {
    updatedTeam.value = null;
    checkedEmployees.value = [];
    createTeamDialog.value?.close();
    isEditing.value = false;
  } else {
    emit("isLoading:true");
    employees.value = await fetchEmployees();
    emit("isLoading:false");
    createTeamDialog.value?.showModal();
  }
};
const fetchEmployees = async () => {
  return axios
    .get(import.meta.env.VITE_API_EMPLOYEE)
    .then(res => res.data)
    .catch(_ => []);
};
const handleCreateTeam = async (event: Event) => {
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  const team = {
    ...formJson,
    employees: checkedEmployees.value,
  };

  try {
    const response = await axios.post(import.meta.env.VITE_API_TEAM, team, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    toggleDialog();
    createTeamForm.value?.reset();
    checkedEmployees.value = [];
    handleResponseMessage(response.data, true);
    emit("team:created");
  } catch (error) {
    toggleDialog();
    createTeamForm.value?.reset();
    checkedEmployees.value = [];
    handleResponseMessage(String((error as AxiosError).response?.data), false);
  }
};

const handleUpdateTeam = async (event: Event) => {
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  const team = {
    ...formJson,
    employees: checkedEmployees.value,
  };

  try {
    const response = await axios.put(
      import.meta.env.VITE_API_TEAM + updatedTeam.value?._id,
      team,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    toggleDialog();
    createTeamForm.value?.reset();
    checkedEmployees.value = [];
    handleResponseMessage(response.data, true);
    emit("team:updated");
  } catch (error) {
    toggleDialog();
    createTeamForm.value?.reset();
    checkedEmployees.value = [];
    handleResponseMessage(String((error as AxiosError).response?.data), false);
  }
};

//computations

const searchedEmployees = computed(() => {
  if (searchInput.value !== "") {
    return employees.value.filter(employee =>
      employee.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
    );
  }
  return employees.value;
});

const handleTeam = (event: Event) => {
  if (isEditing.value) {
    return handleUpdateTeam(event);
  }
  return handleCreateTeam(event);
};

//exposes

defineExpose({
  toggleCreateTeamDialog: toggleDialog,
  updateTeam: defineEdit,
});
</script>
<template>
  <dialog class="modal modal-bottom sm:modal-middle" ref="createTeamDialog">
    <div class="modal-box min-h-0">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="toggleDialog"
      >
        <i class="fa-solid fa-x"></i>
      </button>
      <div>
        <h3 class="font-bold text-lg">Edit {{}}</h3>
      </div>
      <form
        ref="createTeamForm"
        method="post"
        class="form-control gap-3"
        @submit.prevent="handleTeam"
      >
        <label for="name" class="label label-text">Team name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="ex: The lobsters of wall street"
          class="input input-bordered input-primary w-full"
          maxlength="30"
          required
          :value="updatedTeam?.name"
        />

        <label for="description" class="label label-text">
          Team description
        </label>
        <textarea
          id="description"
          name="description"
          class="textarea textarea-primary w-full"
          placeholder="ex: finance department of building nº 3"
          maxlength="40"
          required
          :value="String(updatedTeam?.description ?? '')"
        ></textarea>
        <label for="search-employees" class="label label-text"
          >Total Employees: {{ employees.length }}</label
        >
        <div class="join flex">
          <input
            id="search-employees"
            type="text"
            placeholder="Search employees"
            class="input input-bordered input-primary w-full grow join-item"
            v-model="searchInput"
          />
          <button
            class="btn btn-neutral join-item"
            type="button"
            v-if="searchInput"
            @click="searchInput = ''"
          >
            <i class="fa-solid fa-x"></i>
          </button>
          <button class="btn btn-primary join-item" type="button">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <div class="overflow-y-auto max-h-96">
          <table class="table table-xs">
            <!-- head -->
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="employee in searchedEmployees">
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
        </div>

        <div class="modal-action">
          <button class="btn" type="button" @click="toggleDialog">
            cancel
          </button>
          <button class="btn btn-primary" type="submit" v-if="!isEditing">
            Create
          </button>
          <button class="btn btn-primary" type="submit" v-if="isEditing">
            Update
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>
<style></style>
