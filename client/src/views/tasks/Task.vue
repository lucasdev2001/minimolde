<script lang="ts" setup>
import { employee } from "../../stores/employeeStore";
import { Task } from "../../types";
import AvatarGroup from "../employees/AvatarGroup.vue";

defineProps<{
  task: Task;
}>();

const emit = defineEmits(["task:update", "task:delete", "task:status"]);
</script>
<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="dropdown dropdown-left self-end absolute top-0">
      <label tabindex="0" class="btn btn-ghost m-1">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </label>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li
          v-if="
            employee.roles.includes('manager') ||
            (task.assignedType === 'self' &&
              task.assignedTo.includes(employee._id))
          "
        >
          <a @click="emit('task:update')">
            <i class="fa-solid fa-pen-to-square"></i>
          </a>
        </li>
        <li v-if="task.status !== 'started'">
          <a class="hover:bg-success" @click="emit('task:status', 'started')"
            >Mark as started</a
          >
        </li>
        <li v-if="task.status !== 'inProgress'">
          <a class="hover:bg-warning" @click="emit('task:status', 'inProgress')"
            >Mark as in progress</a
          >
        </li>
        <li v-if="task.status !== 'completed'">
          <a @click="emit('task:status', 'completed')">Mark as completed</a>
        </li>

        <li
          v-if="
            employee.roles.includes('manager') ||
            (task.assignedType === 'self' &&
              task.assignedTo.includes(employee._id))
          "
        >
          <a @click="emit('task:delete')"><i class="fa-solid fa-trash"></i></a>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <div class="flex justify-between">
        <h2 class="card-title">
          {{ task.title }}
        </h2>
      </div>
      <p>{{ task.description }}</p>
      <div class="card-actions justify-between">
        <AvatarGroup
          :employees="[...task.employees!]"
          v-if="task.assignedType !== 'team'"
        />
      </div>
    </div>
  </div>
</template>
