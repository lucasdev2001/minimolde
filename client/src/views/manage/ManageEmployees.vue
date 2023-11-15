<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { employee } from "../../stores/employeeStore";
import { Employee } from "../../types";
import axios from "axios";
import AvatarGroup from "../employees/AvatarGroup.vue";
import handleResponseMessage from "../../utils/handleResponseMessage";

//lifecycles

onMounted(async () => {
  employees.value = await fetchEmployees();
});
const employees = ref<Employee[]>([]);
const updateEmployee = ref<Employee>();

//components refs

//refs

const editDialog = ref<HTMLDialogElement>();
const roles = ref("");
const isLoading = ref(false);

const toggleEditDialog = (employee?: Employee) => {
  if (editDialog.value?.open) {
    editDialog.value.close();
  } else {
    updateEmployee.value = employee;
    roles.value = String(updateEmployee.value?.roles);
    editDialog.value?.showModal();
  }
};

const handleEditEmployeeRoles = async () => {
  isLoading.value = true;
  try {
    const res = await await axios.put(
      import.meta.env.VITE_API_EMPLOYEE + updateEmployee.value?._id,
      {
        roles: roles.value,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    isLoading.value = false;
    handleResponseMessage(res.data, true);
  } catch (error) {
    isLoading.value = false;
    handleResponseMessage((error as Error).message, false);
  }
  toggleDialog();
  employees.value = await fetchEmployees();
};

const searchInput = ref("");

//functions

const fetchEmployees = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(import.meta.env.VITE_API_EMPLOYEE, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const employees = res.data as Employee[];
    isLoading.value = false;
    return employees.filter(employees => employees._id !== employee.value._id);
  } catch (error) {
    console.log(error);
    isLoading.value = false;
    return [];
  }
};

const searchedEmployees = computed(() =>
  [...employees.value].filter(team =>
    team.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
  )
);

const checkedEmployees = ref<string[]>([]);

const toggleDialog = async () => {
  if (dialog.value?.open) {
    dialog.value?.close();
  } else {
    checkedEmployees.value.length > 0 && dialog.value?.showModal();
  }
};

const handleDeleteEmployee = async () => {
  try {
    const res = await axios.delete(import.meta.env.VITE_API_EMPLOYEE, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: {
        employees: checkedEmployees.value,
      },
    });
    employees.value = await fetchEmployees();
    toggleDialog();
    handleResponseMessage(res.data, true);
  } catch (error) {
    toggleDialog();
    handleResponseMessage((error as Error).message, false);
  }
};

const dialog = ref<HTMLDialogElement>();
</script>
<template>
  <header class="flex flex-row justify-between">
    <hgroup>
      <h1 class="text-3xl">Hi {{ employee.name }} 👋</h1>
      <h2>Manage your employees</h2>
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

    <div
      class="max-h-screen h-screen sm:overflow-clip overflow-auto hover:overflow-auto"
    >
      <table class="table table-xs">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th class="hidden lg:flex">Email</th>
            <th>roles</th>
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
                <button
                  class="btn btn-ghost btn-xs"
                  @click="toggleEditDialog(employee)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
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

  <dialog class="modal modal-bottom sm:modal-middle" ref="editDialog">
    <form
      method="dialog"
      class="modal-box flex flex-col gap-3"
      @submit="handleEditEmployeeRoles"
    >
      <h3 class="font-bold text-lg">edit {{ updateEmployee?.name }} roles</h3>
      <textarea class="textarea textarea-primary w-full" v-model="roles">
      </textarea>
      <div class="modal-action">
        <button class="btn" @click.prevent="toggleEditDialog()">cancel</button>
        <button class="btn btn-primary">save</button>
      </div>
    </form>
  </dialog>
</template>
