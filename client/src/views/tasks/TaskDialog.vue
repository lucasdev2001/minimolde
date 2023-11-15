<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { Employee, Task, Team } from "../../types";
import axios from "axios";
import handleResponseMessage from "../../utils/handleResponseMessage";
import AvatarGroup from "../employees/AvatarGroup.vue";
import { employee } from "../../stores/employeeStore";

//emits

const emit = defineEmits([
  "isLoading:true",
  "isLoading:false",
  "task:created",
  "task:updated",
]);

//refs and reactives

interface ClientTask extends Task {
  checkedEmployees: string[];
  checkedTeam: string;
}

const isLoading = ref(false);

const rawTask: ClientTask = {
  //raw task state so we can reset later
  title: "",
  description: "",
  assignedType: "self",
  assignedTo: [employee.value._id],
  status: "started",
  checkedEmployees: [],
  checkedTeam: "",
};

const proxyTask = reactive<ClientTask>({
  title: "",
  description: "",
  assignedType: "self",
  assignedTo: [employee.value._id],
  status: "started",
  checkedEmployees: [],
  checkedTeam: "",
});

//computations
const assignedTo = computed(() => {
  switch (proxyTask.assignedType) {
    case "self":
      return [employee.value._id];

    case "employees":
      return proxyTask.checkedEmployees;

    case "team":
      return [proxyTask.checkedTeam];

    default:
      return [employee.value._id];
  }
});

const employees = ref<Employee[]>([]);
const team = ref<Team[]>([]);
const dialog = ref<HTMLDialogElement>();
const searchInput = ref("");
const isUpadting = ref(false);

//functions
const prepareUpdate = (task: Task) => {
  isUpadting.value = true;
  Object.assign(proxyTask, task);
  proxyTask.checkedEmployees = task.assignedTo;
  proxyTask.checkedTeam = task.assignedTo[0];
  toggleDialog();
};

const resetTask = () => {
  Object.assign(proxyTask, rawTask);
};
const toggleDialog = async () => {
  if (dialog.value?.open) {
    resetTask();
    dialog.value.close();
  } else {
    emit("isLoading:true");
    employees.value = await fetchEmployees();
    team.value = await fetchTeams();
    emit("isLoading:false");
    dialog.value?.showModal();
  }
};
const fetchEmployees = async () => {
  try {
    const res = await axios(import.meta.env.VITE_API_EMPLOYEE, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const fetchTeams = async () => {
  try {
    const res = await axios(import.meta.env.VITE_API_TEAM, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const handleCreateTask = async () => {
  proxyTask.assignedTo = assignedTo.value;
  isLoading.value = true;
  try {
    const res = await axios.post(import.meta.env.VITE_API_TASKS, proxyTask, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    emit("task:created");
    toggleDialog();
    handleResponseMessage(res.data, true);
  } catch (error) {
    toggleDialog();
    handleResponseMessage(String(error), true);
  }
  isLoading.value = false;
};

const handleUpdateTask = async () => {
  proxyTask.assignedTo = assignedTo.value;
  isLoading.value = true;
  try {
    const res = await axios.put(
      import.meta.env.VITE_API_TASKS + proxyTask._id,
      proxyTask,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    emit("task:updated");
    toggleDialog();
    handleResponseMessage(res.data, true);
  } catch (error) {
    toggleDialog();
    handleResponseMessage(String(error), true);
  }
  isLoading.value = false;
};

const searchedEmployees = computed(() =>
  [...employees.value].filter(employee =>
    employee.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
  )
);
const searchedTeams = computed(() =>
  [...team.value].filter(team =>
    team.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
  )
);

const handleSubmit = () => {
  if (isUpadting.value) {
    return handleUpdateTask();
  } else {
    return handleCreateTask();
  }
};

onMounted(() => {
  dialog.value?.addEventListener("cancel", () => {
    resetTask();
    isUpadting.value = false;
  });
});

//exposes

defineExpose({
  createTask: toggleDialog,
  updateTask: prepareUpdate,
});
</script>
<template>
  <dialog class="modal modal-bottom sm:modal-middle" ref="dialog">
    <div class="modal-box min-h-0 overflow-y-auto">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="toggleDialog"
      >
        <i class="fa-solid fa-x"></i>
      </button>
      <div>
        <h3 class="font-bold text-lg">Create a new task</h3>
        <AvatarGroup
          v-if="proxyTask.assignedType === 'employees'"
          :employees="[
            ...employees.filter(employee =>
              proxyTask.checkedEmployees.includes(employee._id)
            ),
          ]"
        />
      </div>
      <form method="post" class="form-control" @submit.prevent="handleSubmit">
        <label for="title" class="label label-text">Task title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="ex: complete Johns & brothers merging "
          class="input input-bordered input-primary w-full"
          maxlength="30"
          required
          v-model="proxyTask.title"
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
          v-model="proxyTask.description"
        ></textarea>

        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Myself</span>
            <input
              type="radio"
              name="assignedType"
              class="radio"
              value="self"
              v-model="proxyTask.assignedType"
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Employees</span>
            <input
              type="radio"
              class="radio"
              name="assignedType"
              value="employees"
              v-model="proxyTask.assignedType"
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Team</span>
            <input
              type="radio"
              name="assignedType"
              class="radio"
              value="team"
              v-model="proxyTask.assignedType"
            />
          </label>
        </div>

        <template v-if="proxyTask.assignedType === 'employees'">
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
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Roles</th>
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
                          v-model="proxyTask.checkedEmployees"
                        />
                      </label>
                    </th>
                    <td>
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-12 h-12">
                            <img :src="employee.profilePicture" />
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

        <template v-if="proxyTask.assignedType === 'team'">
          <label for="search-team" class="label label-text"
            >Total team: {{ team.length }}</label
          >
          <div class="join flex">
            <input
              id="search-team"
              type="text"
              placeholder="Search team"
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
                          :checked="
                            proxyTask.assignedTo.includes(team._id ?? '')
                          "
                          v-model="proxyTask.checkedTeam"
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
          <button class="btn" type="button" @click="toggleDialog">
            cancel
          </button>
          <button
            class="btn btn-primary"
            type="submit"
            v-if="!isUpadting"
            :disabled="isLoading"
          >
            Create
            <span
              class="loading loading-spinner loading-xs"
              v-if="isLoading"
            ></span>
          </button>
          <button
            class="btn btn-primary"
            type="submit"
            v-if="isUpadting"
            :disabled="isLoading"
          >
            Update
            <span
              class="loading loading-spinner loading-xs"
              v-if="isLoading"
            ></span>
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>
