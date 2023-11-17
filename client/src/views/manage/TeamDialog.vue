<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { Employee, Team } from "../../types";
import axios, { AxiosError } from "axios";
import handleResponseMessage from "../../utils/handleResponseMessage";
import AvatarGroup from "../employees/AvatarGroup.vue";

//emits

const emit = defineEmits([
  "isLoading:true",
  "isLoading:false",
  "team:created",
  "team:updated",
]);

//refs
const employees = ref<Employee[]>([]);
const dialog = ref<HTMLDialogElement | null>(null);
const isLoading = ref(false);

interface ClientTeam extends Omit<Team, "employees"> {
  employees: Employee[] | string[];
  checkedEmployees: string[];
}

const rawTeam: ClientTeam = {
  //keeping a raw state so we can reset proxy later
  _id: null,
  name: "",
  description: "",
  employees: [],
  checkedEmployees: [],
};

const proxyTeam = reactive<ClientTeam>({
  name: "",
  description: "",
  employees: [],
  checkedEmployees: [],
});

const searchInput = ref("");
const isUpdating = ref(false);

//functions
const prepareUpdate = (team: Team) => {
  isUpdating.value = true;
  Object.assign(proxyTeam, team);
  proxyTeam.checkedEmployees = team.employees.map(employee => employee._id);
  toggleDialog();
};
const toggleDialog = async () => {
  if (dialog.value?.open) {
    resetTeam();
    dialog.value?.close();
  } else {
    emit("isLoading:true");
    employees.value = await fetchEmployees();
    emit("isLoading:false");
    dialog.value?.showModal();
  }
};
const fetchEmployees = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(import.meta.env.VITE_API_EMPLOYEE, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    isLoading.value = false;

    return res.data;
  } catch (error) {
    isLoading.value = false;

    console.log(error);
  }
};

const resetTeam = () => {
  Object.assign(proxyTeam, rawTeam);
};

const handleCreateTeam = async () => {
  isLoading.value = true;
  proxyTeam.employees = proxyTeam.checkedEmployees;
  try {
    const res = await axios.post(import.meta.env.VITE_API_TEAM, proxyTeam, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    toggleDialog();
    resetTeam();
    handleResponseMessage(res.data, true);
    emit("team:created");
  } catch (error) {
    toggleDialog();
    handleResponseMessage(String((error as AxiosError).response?.data), false);
  }
  isLoading.value = false;
};

const handleUpdateTeam = async () => {
  isLoading.value = true;
  proxyTeam.employees = proxyTeam.checkedEmployees;

  try {
    const res = await axios.put(
      import.meta.env.VITE_API_TEAM + proxyTeam._id,
      proxyTeam,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    toggleDialog();
    resetTeam();
    handleResponseMessage(res.data, true);
    emit("team:created");
  } catch (error) {
    toggleDialog();
    handleResponseMessage(String((error as AxiosError).response?.data), false);
  }
  isLoading.value = false;
};

//computations

const searchedEmployees = computed(() =>
  [...employees.value].filter(employee =>
    employee.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
  )
);

const handleSubmit = () => {
  if (isUpdating.value) {
    return handleUpdateTeam();
  }
  return handleCreateTeam();
};

onMounted(() => {
  dialog.value?.addEventListener("close", () => {
    isUpdating.value = false;
    resetTeam();
  });
});

//exposes

defineExpose({
  toggleCreateTeamDialog: toggleDialog,
  updateTeam: prepareUpdate,
});
</script>
<template>
  <dialog class="modal modal-bottom sm:modal-middle" ref="dialog">
    <div class="modal-box min-h-0">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="toggleDialog"
      >
        <i class="fa-solid fa-x"></i>
      </button>
      <div>
        <h3 class="font-bold text-lg">Create a new team</h3>
        <AvatarGroup
          :employees="[
            ...employees.filter(employee =>
              proxyTeam.checkedEmployees.includes(employee._id)
            ),
          ]"
        />
      </div>
      <form
        ref="createTeamForm"
        method="post"
        class="form-control"
        @submit.prevent="handleSubmit"
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
          v-model="proxyTeam.name"
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
          v-model="proxyTeam.description"
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
                        v-model="proxyTeam.checkedEmployees"
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
                  <td class="flex flex-col gap-1">
                    <template v-for="role in employee.roles">
                      <span class="badge badge-ghost badge-sm">
                        {{ role }}
                      </span>
                    </template>
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
          <button
            class="btn btn-primary"
            type="submit"
            v-if="!isUpdating"
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
            v-if="isUpdating"
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
