<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref } from "vue";
import jwt_decode from "jwt-decode";
import { Employee, Task } from "../types";
import axios from "axios";
import Toast from "../components/Toast.vue";
import TaskVue from "../components/teams/Task.vue";

const codedToken = localStorage.getItem("token");
const employee = ref<Employee>({
  _id: "",
  email: "",
  name: "",
  roles: [],
  teams: [],
  profilePicture: "",
});
const tasks = ref<Task[]>([]);
const assignedToRadioInput = ref("");
const checkedEmployees = ref([]);
const checks = ref(true);
const startedTasks = computed(() =>
  tasks.value.filter(task => task.status === "started")
);

const apiResponseMessage = ref<{ message: string; success: boolean } | null>();
const handleApiResponseMessage = (message: string, success: boolean) => {
  apiResponseMessage.value = { message, success };
  setTimeout(() => {
    apiResponseMessage.value = null;
  }, 3000);
};

const createTaskModal = ref<HTMLDialogElement>();
onBeforeMount(async () => {
  if (codedToken) {
    const decoded = jwt_decode(codedToken) as Employee;
    const response = await axios.get(
      import.meta.env.VITE_API_ADDRES_FIND_ONE_EMPLOYEE + decoded._id
    );
    employee.value = response.data;
  }
  tasks.value = await fetchTasks();
});

const createTaskModalToggle = () => {
  if (createTaskModal.value?.open === true) {
    createTaskModal.value.close();
  } else {
    createTaskModal.value?.showModal();
  }
};
const fetchTasks = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ADDRES_FIND_TASKS_ASSIGNED_TO +
        employee.value._id
    );
    return response.data;
  } catch (error) {
    console.log((error as Error).message);
    return [];
  }
};

const handleCreateTask = async (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());
  console.log(formJson);
  console.log(checkedEmployees.value);

  /*  try {
    const response = await axios.post(
      import.meta.env.VITE_API_ADDRES_TASKS,
      formJson
    );
    tasks.value = await fetchTasks();
    console.log(startedTasks.value as Task[]);

    handleApiResponseMessage(response.data, true);
  } catch (error) {
    handleApiResponseMessage((error as Error).message, false);
  }
  createTaskModalToggle(); */
};

const people = reactive([
  {
    _id: "1",
    email: "employee1@example.com",
    name: "John Doe",
    roles: ["Developer"],
    teams: ["Team A"],
    profilePicture: "john-doe.jpg",
  },
  {
    _id: "2",
    email: "employee2@example.com",
    name: "Jane Smith",
    roles: ["Designer"],
    teams: ["Team B"],
    profilePicture: "jane-smith.jpg",
  },
  {
    _id: "3",
    email: "employee3@example.com",
    name: "Alice Johnson",
    roles: ["Manager"],
    teams: ["Team C"],
    profilePicture: "alice-johnson.jpg",
  },
]);

const searchInput = ref("");

const filteredPeople = computed(() => {
  return people.filter(person =>
    person.name.toUpperCase().startsWith(searchInput.value.toUpperCase())
  );
});
</script>

<template>
  <main class="flex flex-col p-3">
    <div class="flex flex-row justify-between">
      <hgroup class="prose font-thin">
        <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
        <h2 class="font-thin m-0">Your tasks</h2>
      </hgroup>
    </div>

    <div class="divider"></div>

    <div class="text-end">
      <button class="btn btn-primary" @click="createTaskModalToggle">
        Create Task
      </button>
    </div>

    <br /><br />
    <div class="flex justify-between gap-3">
      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-success mb-3">Just Started</button>
          <div class="flex flex-col gap-3">
            <template v-for="startedTask in (startedTasks as Task[])">
              <TaskVue
                :title="startedTask.title"
                :description="startedTask.description"
              />
            </template>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-warning mb-3">In Progress</button>
          <div class="flex flex-col gap-3">
            <template v-for="inProgressTask in [0, 1, 2, 3]">
              <TaskVue />
            </template>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-neutral mb-3">Completed</button>
          <div class="flex flex-col gap-3">
            <template v-for="completedTask in (completedTasks as Task[])">
              <TaskVue
                :title="completedTask.title"
                :description="completedTask.description"
              />
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </main>

  <!-- off canvas -->

  <dialog class="modal modal-bottom lg:modal-middle" ref="createTaskModal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          <i class="fa-solid fa-x"></i>
        </button>
      </form>
      <div class="flex justify-between">
        <h3 class="font-bold text-lg">Create a new task</h3>
      </div>
      <form class="form-control gap-3" @submit="handleCreateTask">
        <label for="title" class="label"></label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Task title"
          class="input input-bordered input-primary w-full"
        />

        <textarea
          name="description"
          class="textarea textarea-primary"
          placeholder="Description"
        ></textarea>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Myself</span>
            <input
              type="radio"
              name="assignedTo"
              class="radio radio-primary"
              :value="employee._id"
              v-model="assignedToRadioInput"
              @change="() => console.log(assignedToRadioInput)"
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Team</span>
            <input
              type="radio"
              name="assignedTo"
              class="radio radio-primary"
              value="team"
              v-model="assignedToRadioInput"
              @change="() => console.log(assignedToRadioInput)"
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer disabled">
            <span class="label-text">Employees</span>
            <input
              type="radio"
              name="assignedTo"
              class="radio radio-primary"
              value="employees"
              v-model="assignedToRadioInput"
              @change="() => console.log(assignedToRadioInput)"
            />
          </label>
        </div>
        <div class="avatar-group -space-x-6">
          <div class="avatar">
            <div class="w-12">
              <img :src="employee.profilePicture" />
            </div>
          </div>
          <div class="avatar">
            <div class="w-12">
              <img :src="employee.profilePicture" />
            </div>
          </div>
          <div class="avatar">
            <div class="w-12">
              <img :src="employee.profilePicture" />
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="search employee"
          class="input input-bordered input-primary w-full max-w-xs"
          v-model="searchInput"
        />

        <div class="form-control" v-if="assignedToRadioInput === 'employees'">
          <div class="overflow-x-auto">
            <table class="table">
              <!-- head -->
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Job</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="person in people" v-if="!searchInput">
                  <tr>
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          class="checkbox"
                          name="employee"
                          :value="
                            JSON.stringify({
                              _id: person._id,
                              email: person.email,
                            })
                          "
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
                          <div class="font-bold">{{ person.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-ghost badge-sm">
                        {{ person.roles.map(role => role) }}</span
                      >
                    </td>
                    <th>
                      <button class="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                </template>
                <template
                  v-for="person in filteredPeople"
                  v-if="searchInput.length > 0"
                >
                  <tr>
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          class="checkbox"
                          name="employee"
                          :value="
                            JSON.stringify({
                              _id: person._id,
                              email: person.email,
                            })
                          "
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
                          <div class="font-bold">{{ person.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-ghost badge-sm">
                        {{ person.roles.map(role => role) }}</span
                      >
                    </td>
                    <th>
                      <button class="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-action">
          <button
            class="btn btn-neutral"
            @click="createTaskModalToggle"
            type="button"
          >
            Cancel
          </button>
          <button class="btn btn-primary" type="submit">Create</button>
        </div>
      </form>
    </div>
  </dialog>

  <Toast
    v-if="apiResponseMessage"
    :message="apiResponseMessage.message"
    :icon="apiResponseMessage.success ? '✅' : '❌'"
  />
</template>
