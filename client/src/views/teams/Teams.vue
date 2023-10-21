<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import TaskDialog from "../tasks/TaskDialog.vue";
import DeleteTaskDialog from "../tasks/DeleteTaskDialog.vue";

import { Task, Team } from "../../types";
import TaskVue from "../tasks/Task.vue";
import axios from "axios";
import handleApiResponseMessage from "../../utils/handleApiResponseMessage";
import { startCase } from "lodash";
import { useRoute } from "vue-router";
import AvatarGroup from "../employees/AvatarGroup.vue";
import { router } from "../../router";

//refs
const route = useRoute();
const team = ref<Team>({
  name: "",
  description: "",
  employees: [],
});
const teamName = computed(() => {
  return route.params.team as string;
});

console.log(teamName.value, 9000);

const taskDialog = ref<InstanceType<typeof TaskDialog>>();
const deleteTaskDialog = ref<InstanceType<typeof DeleteTaskDialog>>();
const tasks = ref<Task[]>([]);
const isTasksViewList = ref(true);
const query = reactive<{
  status: "started" | "inProgress" | "completed";
}>({
  status: "started",
});

//functions
const toggleIsTasksViewList = () => {
  isTasksViewList.value = !isTasksViewList.value;
};

const handleTaskStatus = async (
  status: "started" | "inProgress" | "completed",
  _id: string
) => {
  try {
    const res = await axios.put(import.meta.env.VITE_API_TASKS + _id, {
      status,
    });
    query.status = status;
    tasks.value = await fetchTasks();
    handleApiResponseMessage(res.data, true);
  } catch (error) {
    console.log(error);
    handleApiResponseMessage((error as Error).message, false);
  }
};

const searchInput = ref("");
const fetchTasks = async () => {
  return axios
    .get(import.meta.env.VITE_API_TASKS_ASSIGNED_TO + team.value._id)
    .then(res => res.data)
    .catch(_ => []);
};

//computations

const searchedTasks = computed(() => {
  if (searchInput.value !== "") {
    return tasks.value.filter(tasks =>
      tasks.title.toUpperCase().startsWith(searchInput.value.toUpperCase())
    );
  }
  return tasks.value;
});

const completedTasks = computed(() => {
  return searchedTasks.value.filter(task => task.status === "completed");
});

const startedTasks = computed(() => {
  return searchedTasks.value.filter(task => task.status === "started");
});

const inProgressTasks = computed(() => {
  return searchedTasks.value.filter(task => task.status === "inProgress");
});

onMounted(async () => {
  console.log(teamName.value);

  const res = await axios.get(import.meta.env.VITE_API_TEAM + teamName.value);
  team.value = res.data;

  console.log(route.meta);

  tasks.value = await fetchTasks();
});

watch(useRoute(), async () => {
  if (route.name === "teams") {
    const res = await axios.get(
      import.meta.env.VITE_API_TEAM + startCase(teamName.value)
    );
    team.value = res.data;
    tasks.value = await fetchTasks();

    router.currentRoute.value.meta = {
      team: team.value,
    };

    console.log(route.meta);
  }
});
</script>

<template>
  <header class="flex flex-row justify-between">
    <div>
      <hgroup class="prose font-thin">
        <h1 class="font-thin m-0">{{ team.name }}</h1>
        <h2 class="font-thin m-0">{{ team.description }}</h2>
      </hgroup>
      <AvatarGroup :employees="team.employees" />
    </div>
    <button class="btn btn-primary self-end" @click="taskDialog?.createTask()">
      create task
    </button>
  </header>
  <progress class="progress" value="100" max="100"></progress>
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
    <!-- LIST -->

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
      <div class="flex flex-col gap-3">
        <template
          v-if="query.status === 'started'"
          v-for="task in startedTasks"
        >
          <TaskVue
            :task="task"
            @task:edit="taskDialog?.editTask(task)"
            @task:delete="deleteTaskDialog?.deleteTask(task)"
            @task:status="e => handleTaskStatus(e,task._id!)"
          />
        </template>
      </div>

      <div class="flex flex-col gap-3">
        <template
          v-if="query.status === 'inProgress'"
          v-for="task in inProgressTasks"
        >
          <TaskVue
            :task="task"
            @task:edit="taskDialog?.editTask(task)"
            @task:delete="deleteTaskDialog?.deleteTask(task)"
            @task:status="e => handleTaskStatus(e,task._id!)"
          />
        </template>
      </div>

      <div class="flex flex-col gap-3">
        <template
          v-if="query.status === 'completed'"
          v-for="task in completedTasks"
        >
          <TaskVue
            :task="task"
            @task:edit="taskDialog?.editTask(task)"
            @task:delete="deleteTaskDialog?.deleteTask(task)"
            @task:status="e => handleTaskStatus(e,task._id!)"
          />
        </template>
      </div>
    </div>

    <!-- GRID -->

    <div class="sm:flex flex-row hidden gap-3" v-if="!isTasksViewList">
      <div class="basis-1/3 grow" v-if="startedTasks.length > 0">
        <button class="btn btn-success hover:btn-active">Just started</button>
        <div class="flex flex-col gap-3">
          <template v-for="task in startedTasks">
            <TaskVue
              :task="task"
              @task:edit="taskDialog?.editTask(task)"
              @task:delete="deleteTaskDialog?.deleteTask(task)"
              @task:status="e => handleTaskStatus(e,task._id!)"
            />
          </template>
        </div>
      </div>
      <div class="basis-1/3 grow" v-if="inProgressTasks.length > 0">
        <button class="btn btn-warning hover:btn-active">In Progress</button>
        <div class="flex flex-col gap-3">
          <template v-for="task in inProgressTasks">
            <TaskVue
              :task="task"
              @task:edit="taskDialog?.editTask(task)"
              @task:delete="deleteTaskDialog?.deleteTask(task)"
              @task:status="e => handleTaskStatus(e,task._id!)"
            />
          </template>
        </div>
      </div>
      <div class="basis-1/3 grow" v-if="completedTasks.length > 0">
        <button class="btn btn-neutral hover:btn-active">Completed</button>
        <div class="flex flex-col gap-3">
          <template v-for="task in completedTasks">
            <TaskVue
              :task="task"
              @task:edit="taskDialog?.editTask(task)"
              @task:delete="deleteTaskDialog?.deleteTask(task)"
              @task:status="e => handleTaskStatus(e,task._id!)"
            />
          </template>
        </div>
      </div>
    </div>
  </main>

  <TaskDialog
    ref="taskDialog"
    @task:updated="async () => (tasks = await fetchTasks())"
    @task:created="async () => (tasks = await fetchTasks())"
  />
  <DeleteTaskDialog
    ref="deleteTaskDialog"
    @task:delete="async () => (tasks = await fetchTasks())"
  />
</template>
