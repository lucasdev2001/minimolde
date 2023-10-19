<script lang="ts" setup>
import { reactive, ref } from "vue";
import TaskDialog from "./TaskDialog.vue";

const taskDialog = ref<InstanceType<typeof TaskDialog>>();
const isTasksViewList = ref(true);
const query = reactive<{
  status: string | null;
}>({
  status: "started",
});
const toggleIsTasksViewList = () => {
  isTasksViewList.value = !isTasksViewList.value;
  if (!isTasksViewList) {
    query.status = null;
  }
};
</script>

<template>
  <header>
    <button class="btn btn-primary" @click="taskDialog?.toggleDialog()">
      Create task
    </button>
  </header>
  <progress class="progress" value="100" max="100"></progress>
  <main class="flex flex-col gap-3 h-full">
    <div class="hidden sm:flex">
      <button class="btn" @click="toggleIsTasksViewList">
        <i class="fa-solid fa-table-columns" v-if="isTasksViewList"></i>
        <i class="fa-solid fa-table-list" v-if="!isTasksViewList"></i>
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
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio ullam
        voluptates in laborum tempora officia eius dolores placeat, quia est
        nulla, eveniet reiciendis earum. Nisi quisquam veniam quia aspernatur
        expedita.
      </p>
    </div>

    <div class="sm:flex flex-row hidden" v-if="!isTasksViewList">
      <div class="basis-1/3 grow">
        <button class="btn btn-success hover:btn-active">Just started</button>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo animi
          libero necessitatibus voluptatem. Perspiciatis minima molestiae, omnis
          nihil laborum quo recusandae voluptas dolor similique assumenda,
          accusamus dignissimos unde nam in.
        </p>
      </div>
      <div class="basis-1/3 grow">
        <button class="btn btn-warning hover:btn-active">In Progress</button>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          nostrum sequi magnam dignissimos obcaecati ipsa, porro molestias,
          dolorum excepturi sed architecto quidem tempore soluta laudantium
          perspiciatis. Voluptas ad voluptate non.
        </p>
      </div>
      <div class="basis-1/3 grow">
        <button class="btn btn-neutral hover:btn-active">Completed</button>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla,
          eligendi repudiandae ratione veritatis deserunt beatae deleniti,
          officiis nostrum perferendis dolorum et eaque aliquid provident! Odio
          ea voluptas voluptatum consequatur beatae?
        </p>
      </div>
    </div>
  </main>

  <TaskDialog ref="taskDialog" />
</template>
