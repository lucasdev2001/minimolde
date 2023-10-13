<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import jwt_decode from "jwt-decode";
import { Employee, Task } from "../types";
import axios from "axios";
import Toast from "../components/Toast.vue";
import handleApiResponseMessage from "../utils/handleApiResponseMessage";
import Taskvue from "../components/tasks/Task.vue";

onBeforeMount(async () => {
  if (codedToken) {
    const decoded = jwt_decode(codedToken) as Employee;
    const response = await axios.get(
      import.meta.env.VITE_API_ADDRES_FIND_ONE_EMPLOYEE + decoded._id
    );
    employee.value = response.data;
  }

  tasks.value = await fetchTasks();
  console.log(tasks.value, 9000);
});

const codedToken = localStorage.getItem("token");
const employee = ref<Employee>({
  _id: "",
  email: "",
  name: "",
  roles: [],
  teams: [],
  profilePicture: "",
});
const tasks = ref<{
  pages: number;
  tasks: Task[];
}>({
  pages: 0,
  tasks: [],
});
const taskStatus = ref<"started" | "inProgress" | "completed" | null>(
  "started"
);
const tasksPage = ref<Number>(0);
const tasksQuery = computed(() => {
  return `?limit=2&page=${tasksPage.value}`;
});

const assignedToRadioInput = ref("");
const checkedEmployees = ref([]);

const apiResponseMessage = ref<{ message: string; success: boolean } | null>();

const createTaskModal = ref<HTMLDialogElement>();

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
        employee.value._id +
        tasksQuery.value
    );
    console.log(response.data);

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
  const axiosConfig = {
    headers: {
      Authorization: "Bearer " + codedToken,
    },
  };

  try {
    const response = await axios.post(
      import.meta.env.VITE_API_ADDRES_TASKS,
      formJson,
      axiosConfig
    );
    tasks.value = await fetchTasks();
    console.log(tasks.value);

    handleApiResponseMessage(response.data, true, apiResponseMessage);
  } catch (error) {
    handleApiResponseMessage(
      (error as Error).message,
      false,
      apiResponseMessage
    );
  }
  createTaskModalToggle();
};

const searchTask = ref("");

const startedTasks = computed(() => {
  const startedTasks = [
    ...tasks.value.tasks.filter(task => task.status === "started"),
  ];

  if (searchTask.value !== "") {
    return startedTasks.filter(task =>
      task.title.toUpperCase().startsWith(searchTask.value.toUpperCase())
    );
  }
  return startedTasks;
});
</script>

<template>
  <main class="flex flex-col p-3 gap-3 h-full">
    <div class="flex flex-row justify-between">
      <hgroup class="prose font-thin">
        <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
        <h2 class="font-thin m-0">Your tasks</h2>
      </hgroup>
    </div>

    <div class="divider"></div>
    <div class="join justify-end">
      <template v-for="(_, index) in tasks.pages">
        <button
          class="join-item btn"
          :class="tasksPage === index && 'btn-active'"
          @click="
            async () => {
              tasksPage = index;
              tasks = await fetchTasks();
            }
          "
        >
          {{ index + 1 }}
        </button>
      </template>
    </div>

    <div class="flex sm:justify-between">
      <span class="hidden sm:inline">
        <label class="btn swap swap-rotate">
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" />
          <i class="fa-solid fa-bars swap-on"></i>
          <i class="fa-solid fa-table-columns swap-off"></i>
        </label>
      </span>
      <div class="join">
        <input
          type="text"
          placeholder="search task"
          class="input input-bordered w-full max-w-xs join-item"
          v-model="searchTask"
        />
        <button
          class="btn btn-primary join-item"
          @click="createTaskModalToggle"
        >
          CREATE TASK
          <i class="fa-solid fa-add"></i>
        </button>
      </div>
    </div>

    <div class="flex gap-3 flex-wrap">
      <button
        class="btn btn-outline btn-success hover:btn-active grow"
        :class="taskStatus === 'started' && 'btn-active'"
        @click="taskStatus = 'started'"
      >
        Just Started
      </button>

      <button
        class="btn btn-outline btn-warning hover:btn-active grow"
        :class="taskStatus === 'inProgress' && 'btn-active'"
        @click="taskStatus = 'inProgress'"
      >
        In Progress
      </button>
      <button
        class="btn btn-outline btn-neutral hover:btn-active grow"
        :class="taskStatus === 'completed' && 'btn-active'"
        @click="taskStatus = 'completed'"
      >
        Completed
      </button>
    </div>
    <div
      id="started-tasks"
      v-if="taskStatus === 'started'"
      class="flex flex-col gap-3"
    >
      <template v-for="task in startedTasks">
        <Taskvue :title="task.title" :description="task.description" />
      </template>
    </div>
    <div id="in-progress-taks" v-if="taskStatus === 'inProgress'"></div>
    <div id="completed-tasks" v-if="taskStatus === 'completed'"></div>
    <div class="join justify-end mt-auto">
      <template v-for="(_, index) in tasks.pages">
        <button
          class="join-item btn"
          :class="tasksPage === index && 'btn-active'"
          @click="
            async () => {
              tasksPage = index;
              tasks = await fetchTasks();
            }
          "
        >
          {{ index + 1 }}
        </button>
      </template>
    </div>

    <!--  <div class="flex flex-row gap-3">
      <div class="basis-1/3">
        <button class="btn btn-outline btn-success btn-active">
          Just Started
        </button>
        <br />
        <TaskVue :title="'lorem'" :description="'lorem ipsum sit amet dolor'" />
      </div>
      <div class="basis-1/3">
        <button class="btn btn-outline btn-warning hover:btn-active">
          In Progress
        </button>
        <TaskVue :title="'lorem'" :description="'lorem ipsum sit amet dolor'" />
      </div>
      <div class="basis-1/3">
        <button class="btn btn-outline btn-neutral hover:btn-active">
          Completed
        </button>
        <TaskVue :title="'lorem'" :description="'lorem ipsum sit amet dolor'" />
      </div>
    </div> -->
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
          required
        />

        <textarea
          name="description"
          class="textarea textarea-primary"
          placeholder="Description"
          required
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
            />
          </label>
        </div>
        <!-- manager only -->
        <div v-if="employee.roles.includes(`manager`)">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Team</span>
              <input
                type="radio"
                name="assignedTo"
                class="radio radio-primary"
                value="team"
                v-model="assignedToRadioInput"
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
              />
            </label>
          </div>
          <div class="form-control" v-if="assignedToRadioInput === 'employees'">
            <input
              type="text"
              placeholder="search employee"
              class="input input-bordered input-primary w-full max-w-xs"
              v-model="searchInput"
            />
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
                  <!--  <template v-for="person in people" v-if="!searchInput">
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
                </template> -->
                </tbody>
              </table>
            </div>
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
