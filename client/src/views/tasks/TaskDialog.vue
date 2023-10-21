<script setup lang="ts">
import { computed, ref } from "vue";
import { Employee, Task, Team } from "../../types";
import axios, { AxiosError } from "axios";
import handleApiResponseMessage from "../../utils/handleApiResponseMessage";
import AvatarGroup from "../employees/AvatarGroup.vue";
import { employee } from "../../stores/employeeStore";

//emits

const emit = defineEmits([
  "isLoading:true",
  "isLoading:false",
  "task:created",
  "task:updated",
]);

//refs
const task = ref<Task>({
  assignedTo: [],
  description: "",
  status: "",
  title: "",
});

const employees = ref<Employee[]>([]);
const teams = ref<Team[]>([]);
const createTaskForm = ref<HTMLFormElement | null>(null);
const createTaskDialog = ref<HTMLDialogElement | null>(null);
const checkedEmployees = ref<string[]>([]);
const checkedTeam = ref("");
const searchInput = ref("");
const isEditing = ref(false);
const assignedToCheckBox = ref<"myself" | "employees" | "teams">();
const assignedTo = ref<string[]>([employee.value._id]);

//functions
const defineEdit = (updated: Task) => {
  isEditing.value = true;
  task.value = updated;
  toggleTaskDialog();
};
const toggleTaskDialog = async () => {
  if (createTaskDialog.value?.open) {
    checkedEmployees.value = [];
    task.value = {
      description: "",
      status: "",
      title: "",
    };
    if (isEditing.value) {
      emit("task:updated");
    }
    createTaskDialog.value?.close();
    isEditing.value = false;
  } else {
    emit("isLoading:true");
    employees.value = await fetchEmployees();
    teams.value = await fetchTeams();

    emit("isLoading:false");
    createTaskDialog.value?.showModal();
  }
};
const fetchEmployees = async () => {
  return axios
    .get(import.meta.env.VITE_API_EMPLOYEE)
    .then(res => res.data)
    .catch(_ => []);
};
const fetchTeams = async () => {
  return axios
    .get(import.meta.env.VITE_API_TEAM)
    .then(res => res.data)
    .catch(_ => []);
};
const handleCreateTask = async (event: Event) => {
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  switch (assignedToCheckBox.value) {
    case "myself":
      assignedTo.value = [employee.value._id];
      break;

    case "employees":
      assignedTo.value = checkedEmployees.value;
      break;
    case "teams":
      assignedTo.value = [checkedTeam.value];
      break;
    default:
      assignedTo.value = [employee.value._id];

      break;
  }

  const task = {
    ...formJson,
    assignedTo: assignedTo.value,
  };

  try {
    const response = await axios.post(import.meta.env.VITE_API_TASKS, task);
    toggleTaskDialog();
    createTaskForm.value?.reset();
    checkedEmployees.value = [];
    handleApiResponseMessage(response.data, true);
    emit("task:created");
  } catch (error) {
    toggleTaskDialog();
    createTaskForm.value?.reset();
    checkedEmployees.value = [];
    handleApiResponseMessage(
      String((error as AxiosError).response?.data),
      false
    );
  }
};

const handleUpdateTask = async (event: Event) => {
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  const nwTask = {
    ...formJson,
  };

  try {
    const response = await axios.put(
      import.meta.env.VITE_API_TASKS + task.value._id,
      nwTask
    );
    toggleTaskDialog();
    createTaskForm.value?.reset();
    checkedEmployees.value = [];
    handleApiResponseMessage(response.data, true);
    emit("task:updated");
  } catch (error) {
    toggleTaskDialog();
    createTaskForm.value?.reset();
    checkedEmployees.value = [];
    handleApiResponseMessage(
      String((error as AxiosError).response?.data),
      false
    );
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
const searchedTeams = computed(() => {
  if (searchInput.value !== "") {
    return teams.value.filter(team =>
      team.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
    );
  }
  return teams.value;
});

const handleTask = (event: Event) => {
  if (isEditing.value) {
    return handleUpdateTask(event);
  }
  return handleCreateTask(event);
};

//exposes

defineExpose({
  createTask: toggleTaskDialog,
  editTask: defineEdit,
});
</script>
<template>
  <dialog class="modal modal-bottom sm:modal-middle" ref="createTaskDialog">
    <div class="modal-box min-h-0 overflow-y-auto">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="toggleTaskDialog"
      >
        <i class="fa-solid fa-x"></i>
      </button>
      <div>
        <h3 class="font-bold text-lg">Create a new task</h3>
        <AvatarGroup
          v-if="assignedToCheckBox === 'employees'"
          :employees="[
            ...employees.filter(employee =>
              checkedEmployees.includes(employee._id)
            ),
          ]"
        />
      </div>
      <form
        ref="createTaskForm"
        method="post"
        class="form-control gap-3"
        @submit.prevent="handleTask"
      >
        <label for="title" class="label label-text">Task title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="ex: complete Johns & brothers merging "
          class="input input-bordered input-primary w-full"
          maxlength="30"
          required
          v-model="task.title"
        />

        <label for="description" class="label label-text">
          Task description
        </label>
        <textarea
          id="description"
          name="description"
          class="textarea textarea-primary w-full"
          placeholder="ex: We need to complete the merging of Johns & brothers company into BB's software"
          maxlength="90"
          required
          v-model="task.description"
        ></textarea>

        <template v-if="!isEditing">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Myself</span>
              <input
                type="radio"
                name="assignedTo"
                class="radio"
                :value="'myself'"
                v-model="assignedToCheckBox"
                checked
              />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Employees</span>
              <input
                type="radio"
                name="assignedTo"
                class="radio"
                :value="'employees'"
                v-model="assignedToCheckBox"
              />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Team</span>
              <input
                type="radio"
                name="assignedTo"
                class="radio"
                :value="'teams'"
                v-model="assignedToCheckBox"
              />
            </label>
          </div>

          <template v-if="assignedToCheckBox === 'employees'">
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
          </template>
        </template>

        <template v-if="assignedToCheckBox === 'teams'">
          <label for="search-teams" class="label label-text"
            >Total teams: {{ teams.length }}</label
          >
          <div class="join flex">
            <input
              id="search-teams"
              type="text"
              placeholder="Search teams"
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
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="team in searchedTeams">
                  <tr>
                    <th>
                      <label>
                        <input
                          type="radio"
                          class="radio radio-primary"
                          name="team"
                          :value="team._id"
                          v-model="checkedTeam"
                        />
                      </label>
                    </th>

                    <td>
                      <span class="badge badge-ghost badge-sm">
                        {{ team.name }}
                      </span>
                    </td>
                    <td>
                      <span class="badge badge-ghost badge-sm">
                        {{ team.description }}
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
        <div class="modal-action">
          <button class="btn" type="button" @click="toggleTaskDialog">
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
