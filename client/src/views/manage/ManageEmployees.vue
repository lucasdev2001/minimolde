<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { employee } from "../../stores/employeeStore";
import { Employee } from "../../types";
import axios from "axios";
import AvatarGroup from "../employees/AvatarGroup.vue";
import handleApiResponseMessage from "../../utils/handleApiResponseMessage";

//lifecycles

onMounted(async () => {
  employees.value = await fetchEmployees();
});
const employees = ref<Employee[]>([]);
watch(employees, () => {
  employees.value = employees.value.filter(
    employees => employees._id !== employee.value._id
  );
});

//components refs

//refs

const searchInput = ref("");

//functions

const fetchEmployees = async () => {
  return axios
    .get(import.meta.env.VITE_API_EMPLOYEE)
    .then(res => res.data)
    .catch(_ => []);
};

const searchedEmployees = computed(() => {
  if (searchInput.value !== "") {
    return employees.value.filter(team =>
      team.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
    );
  }
  return employees.value;
});

const checkedEmployees = ref<string[]>([]);

const toggleDialog = async () => {
  if (dialog.value?.open) {
    dialog.value?.close();
  } else {
    checkedEmployees.value.length > 0 && dialog.value?.showModal();
  }
};

const handleDeleteEmployee = async () => {
  console.log(checkedEmployees.value);
  try {
    const res = await axios.delete(import.meta.env.VITE_API_EMPLOYEE, {
      data: {
        employees: checkedEmployees.value,
      },
    });
    employees.value = await fetchEmployees();
    toggleDialog();
    handleApiResponseMessage(res.data, true);
  } catch (error) {
    toggleDialog();
    handleApiResponseMessage((error as Error).message, false);
  }
};

const dialog = ref<HTMLDialogElement>();
</script>
<template>
  <header class="flex flex-row justify-between">
    <hgroup class="prose font-thin">
      <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
      <h2 class="font-thin m-0">Manage your employees</h2>
    </hgroup>
  </header>
  <progress class="progress w-full" value="100"></progress>

  <main class="flex flex-col gap-3 h-full">
    <div class="flex justify-between w-full">
      <button class="btn btn-warning me-3" @click="toggleDialog()">
        <i class="fa-solid fa-trash"></i>
      </button>

      <div class="join sm:self-end flex-grow sm:flex-grow-0">
        <input
          type="text"
          class="input input-bordered input-primary w-full max-w-xs join-item"
          placeholder="Search employee"
          v-model="searchInput"
        />
        <button class="btn btn-primary join-item pointer-events-none">
          search
        </button>
      </div>
    </div>

    <div class="overflow-y-auto">
      <table class="table table-xs">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th class="hidden lg:flex">Email</th>
            <th>Job</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="employee in searchedEmployees">
            <!-- row 1 -->
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
                      <img :src="employee.profilePicture" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ employee.name }}</div>
                  </div>
                </div>
              </td>
              <td class="hidden lg:flex">
                {{ employee.email }}
              </td>
              <td>
                <template v-for="role in employee.roles">
                  <span class="badge badge-ghost badge-sm"> {{ role }} </span>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </main>

  <dialog class="modal modal-middle lg:modal-middle" ref="dialog">
    <div class="modal-box flex flex-col gap-3">
      <form method="dialog">
        <i class="fa-solid fa-box-archive text-lg"></i>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          <i class="fa-solid fa-x"></i>
        </button>
      </form>
      <form
        method="post"
        @submit.prevent="handleDeleteEmployee"
        class="form-control gap-3"
      >
        <h3 class="font-bold text-lg">Are you sure ? deleting:</h3>
        <AvatarGroup
          :employees="[
            ...employees.filter(employee =>
              checkedEmployees.includes(employee._id)
            ),
          ]"
        />

        <button class="btn btn-error btn-block" type="submit">delete</button>
      </form>
    </div>
  </dialog>
</template>
