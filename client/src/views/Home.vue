<script lang="ts" setup>
import { ref } from "vue";
import Toast from "../components/Toast.vue";
import { employee } from "../stores/employeeStore";

const apiResponseMessage = ref<{ message: string; success: boolean } | null>();
</script>

<template>
  <header>
    <div class="flex flex-row justify-between">
      <hgroup class="prose font-thin">
        <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
        <h2 class="font-thin m-0">Your tasks</h2>
      </hgroup>
    </div>
  </header>
  <main class="flex flex-col gap-3 h-full">
    <div class="divider"></div>

    <!--     <div
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
 -->
    <div class="flex flex-row gap-3">
      <div class="basis-1/3 grow">
        <button class="btn btn-success btn-active">Just Started</button>
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

  <!-- off canvas -->

  <Toast
    v-if="apiResponseMessage"
    :message="apiResponseMessage.message"
    :icon="apiResponseMessage.success ? '✅' : '❌'"
  />
</template>
