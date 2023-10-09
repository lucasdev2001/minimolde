<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import TaskVue from "../components/teams/Task.vue";
import jwt_decode from "jwt-decode";
import { Employee, Task } from "../types";
import axios from "axios";
import Toast from "../components/Toast.vue";

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
const startedTasks = computed(() =>
  tasks.value.filter(task => task.status === "started")
);
const inProgressTasks = computed(() =>
  tasks.value.filter(task => task.status === "progress")
);
const completedTasks = computed(() =>
  tasks.value.filter(task => task.status === "completed")
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
  try {
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
  createTaskModalToggle();
};

const log = e => {
  console.log(e);
};
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
        <div class="basis-1/3 grow" v-if="startedTasks.length > 0">
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
        <div class="basis-1/3 grow" v-if="inProgressTasks.length > 0">
          <button class="btn btn-warning mb-3">In Progress</button>
          <div class="flex flex-col gap-3">
            <template v-for="inProgressTask in (inProgressTasks as Task[])">
              <TaskVue
                :title="inProgressTask.title"
                :description="inProgressTask.description"
              />
            </template>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div class="basis-1/3 grow" v-if="completedTasks.length > 0">
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
          <div class="avatar placeholder">
            <div class="w-12 bg-neutral-focus text-neutral-content">
              <span>+99</span>
            </div>
          </div>
        </div>
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
              checked
            />
          </label>
        </div>
        <div class="form-control">
          <label
            class="label cursor-pointer"
            v-if="employee.roles.includes('manager')"
          >
            <span class="label-text">Team</span>
            <input
              type="radio"
              name="assignTo"
              class="radio radio-primary"
              disabled
            />
          </label>
        </div>
        <div class="form-control">
          <label
            class="label cursor-pointer disabled"
            v-if="employee.roles.includes('manager')"
          >
            <span class="label-text">People</span>
            <input
              type="radio"
              name="assignTo"
              class="radio radio-primary"
              disabled
            />
          </label>
        </div>

        <div class="modal-action">
          <button class="btn btn-neutral" @click="createTaskModalToggle">
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

<style scoped>
@keyframes slideRight {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slideLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
.fade-enter-active {
  animation: slideRight 0.3s ease-in-out forwards;
}
.fade-leave-active {
  transition: opacity ease;
}

.fade-leave-to {
  animation: slideLeft 0.2s ease-in-out forwards;
}
</style>
