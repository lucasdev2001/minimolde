<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import TaskDialog from "../tasks/TaskDialog.vue";
import DeleteDialog from "../tasks/DeleteDialog.vue";

import { Task, TaskStatus } from "../../types";
import TaskVue from "../tasks/Task.vue";
import axios from "axios";
import { employee } from "../../stores/employeeStore";
import handleApiResponseMessage from "../../utils/handleResponseMessage";
//refs
const taskDialog = ref<InstanceType<typeof TaskDialog>>();
const deleteDialog = ref<InstanceType<typeof DeleteDialog>>();
const isLoading = ref(false);

const isTasksViewList = ref(true);
const query = reactive<{
  status: TaskStatus;
}>({
  status: "started",
});

//functions
const toggleIsTasksViewList = () => {
  isTasksViewList.value = !isTasksViewList.value;
};

const handleTaskStatus = async (status: TaskStatus, _id: string) => {
  isLoading.value = true;
  try {
    const res = await axios.put(
      import.meta.env.VITE_API_TASKS + _id,
      {
        status,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    query.status = status;
    tasks.value = await fetchTasks();
    handleApiResponseMessage(res.data, true);
  } catch (error) {
    console.log(error);
    handleApiResponseMessage((error as Error).message, false);
  }
  isLoading.value = false;
};

const tasks = ref<Task[]>([]);
const searchInput = ref("");
const fetchTasks = async () => {
  isLoading.value = true;
  try {
    const res = await axios(
      import.meta.env.VITE_API_TASKS_ASSIGNED_TO + employee.value._id,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    isLoading.value = false;
    return res.data;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
    return [];
  }
};

//computations

const searchedTasks = computed(_ =>
  [...tasks.value].filter(tasks =>
    tasks.title.toUpperCase().startsWith(searchInput.value.toUpperCase())
  )
);

const completedTasks = computed(_ => {
  return [...searchedTasks.value].filter(task => task.status === "completed");
});

const startedTasks = computed(_ => {
  return [...searchedTasks.value].filter(task => task.status === "started");
});

const inProgressTasks = computed(_ => {
  return [...searchedTasks.value].filter(task => task.status === "inProgress");
});

onMounted(async () => {
  tasks.value = await fetchTasks();
});
</script>

<template>
  <header class="flex flex-row justify-between">
    <hgroup>
      <h1 class="text-3xl">Hi {{ employee.name }} 👋</h1>
      <h2>Here are your tasks</h2>
    </hgroup>
    <button class="btn btn-primary self-end" @click="taskDialog?.createTask()">
      create task
    </button>
  </header>
  <progress
    class="progress"
    :value="isLoading ? '' : '100'"
    max="100"
  ></progress>
  <main class="flex flex-col gap-3 h-full">
    <div class="hidden sm:flex justify-between">
      <button class="btn" @click="toggleIsTasksViewList">
        <i class="fa-solid fa-table-columns" v-if="isTasksViewList"></i>
        <i class="fa-solid fa-table-list" v-if="!isTasksViewList"></i>
      </button>
      <div class="join sm:self-end">
        <input
          type="text"
          class="input input-bordered input-primary w-full max-w-xs join-item"
          placeholder="Search task"
          v-model="searchInput"
        />
        <button class="btn btn-primary join-item pointer-events-none">
          search
        </button>
      </div>
    </div>
    <div class="join sm:self-end sm:hidden">
      <input
        type="text"
        class="input input-bordered input-primary w-full max-w-xs join-item"
        placeholder="Search task"
        v-model="searchInput"
      />
      <button class="btn btn-primary join-item pointer-events-none">
        search
      </button>
    </div>

    <div v-if="isTasksViewList">
      <div class="flex flex-wrap gap-3">
        <button
          class="btn btn-outline btn-success hover:btn-active flex-grow"
          :class="query.status === 'started' && 'btn-active'"
          @click="query.status = 'started'"
        >
          Just started
        </button>
        <button
          class="btn btn-outline btn-warning hover:btn-active flex-grow"
          :class="query.status === 'inProgress' && 'btn-active'"
          @click="query.status = 'inProgress'"
        >
          In progress
        </button>
        <button
          class="btn btn-outline btn-neutral hover:btn-active flex-grow"
          :class="query.status === 'completed' && 'btn-active'"
          @click="query.status = 'completed'"
        >
          completed
        </button>
      </div>
      <div
        class="flex flex-col gap-3 max-h-screen sm:overflow-clip hover:overflow-auto p-3 sm:h-screen overflow-auto"
        v-if="query.status === 'started'"
      >
        <template v-for="task in startedTasks">
          <TaskVue
            :task="task"
            @task:edit="taskDialog?.updateTask(task)"
            @task:delete="deleteDialog?.deleteTask(task)"
            @task:status="e => handleTaskStatus(e,task._id!)"
          />
        </template>
      </div>

      <div
        class="flex flex-col gap-3 max-h-screen sm:overflow-clip hover:overflow-auto p-3 sm:h-screen overflow-auto"
        v-if="query.status === 'inProgress'"
      >
        <template v-for="task in inProgressTasks">
          <TaskVue
            :task="task"
            @task:edit="taskDialog?.updateTask(task)"
            @task:delete="deleteDialog?.deleteTask(task)"
            @task:status="e => handleTaskStatus(e,task._id!)"
          />
        </template>
      </div>

      <div
        class="flex flex-col gap-3 max-h-screen sm:overflow-clip hover:overflow-auto p-3 sm:h-screen overflow-auto"
        v-if="query.status === 'completed'"
      >
        <template v-for="task in completedTasks">
          <TaskVue
            :task="task"
            @task:edit="taskDialog?.updateTask(task)"
            @task:delete="deleteDialog?.deleteTask(task)"
            @task:status="e => handleTaskStatus(e,task._id!)"
          />
        </template>
      </div>
    </div>

    <div class="sm:flex flex-row hidden gap-3" v-if="!isTasksViewList">
      <div class="basis-1/3 grow" v-if="startedTasks.length > 0">
        <button class="btn btn-success hover:btn-active">Just started</button>
        <div
          class="flex flex-col gap-3 max-h-screen sm:overflow-clip hover:overflow-auto p-3 h-screen"
        >
          <template v-for="task in startedTasks">
            <TaskVue
              :task="task"
              @task:edit="taskDialog?.updateTask(task)"
              @task:delete="deleteDialog?.deleteTask(task)"
              @task:status="e => handleTaskStatus(e,task._id!)"
            />
          </template>
        </div>
      </div>
      <div class="basis-1/3 grow" v-if="inProgressTasks.length > 0">
        <button class="btn btn-warning hover:btn-active">In Progress</button>
        <div
          class="flex flex-col gap-3 max-h-screen sm:overflow-clip hover:overflow-auto p-3 h-screen"
        >
          <template v-for="task in inProgressTasks">
            <TaskVue
              :task="task"
              @task:edit="taskDialog?.updateTask(task)"
              @task:delete="deleteDialog?.deleteTask(task)"
              @task:status="e => handleTaskStatus(e,task._id!)"
            />
          </template>
        </div>
      </div>
      <div
        class="basis-1/3 grow max-h-screen sm:overflow-clip hover:overflow-auto p-3 h-screen"
        v-if="completedTasks.length > 0"
      >
        <button class="btn btn-neutral hover:btn-active">Completed</button>
        <div class="flex flex-col gap-3">
          <template v-for="task in completedTasks">
            <TaskVue
              :task="task"
              @task:edit="taskDialog?.updateTask(task)"
              @task:delete="deleteDialog?.deleteTask(task)"
              @task:status="e => handleTaskStatus(e,task._id!)"
            />
          </template>
        </div>
      </div>
    </div>
  </main>

  <TaskDialog
    ref="taskDialog"
    @is-loading:true="isLoading = true"
    @is-loading:false="isLoading = false"
    @task:updated="async () => (tasks = await fetchTasks())"
    @task:created="async () => (tasks = await fetchTasks())"
  />
  <DeleteDialog
    ref="deleteDialog"
    @task:delete="async () => (tasks = await fetchTasks())"
  />
</template>
