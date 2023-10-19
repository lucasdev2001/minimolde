<script setup lang="ts">
import { ref } from "vue";
import { Employee } from "../../types";
const props = defineProps<{
  employees: Employee[];
}>();

const avatarDialog = ref<HTMLDialogElement | null>(null);
const toggleAvatarDialog = () => {
  if (avatarDialog.value?.open) {
    avatarDialog.value.close();
  } else {
    avatarDialog.value?.showModal();
  }
};
</script>
<template>
  <div class="avatar-group -space-x-6">
    <template
      v-for="employee in props.employees.length > 5
        ? [...props.employees.slice(0, 5)]
        : [...props.employees]"
    >
      <div class="avatar" @click="toggleAvatarDialog">
        <div class="w-12">
          <img :src="employee.profilePicture" />
        </div>
      </div>
    </template>
    <template v-if="props.employees.length > 5">
      <div class="avatar placeholder" @click="toggleAvatarDialog">
        <div class="w-12 bg-neutral-focus text-neutral-content">
          <span>+{{ props.employees.length - 5 }}</span>
        </div>
      </div>
    </template>
  </div>

  <dialog class="modal modal-bottom sm:modal-middle" ref="avatarDialog">
    <form method="dialog" class="modal-box">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="toggleAvatarDialog"
      >
        <i class="fa-solid fa-x"></i>
      </button>
      <h3 class="font-bold text-lg">employees</h3>
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>Name</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="employee in employees">
            <tr>
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
                    <div class="font-bold">{{ employee.name }}</div>
                    <div class="text-sm opacity-50 truncate"></div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge badge-ghost badge-sm">
                  <template v-for="role in employee.roles">
                    {{ role }}
                  </template>
                </span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </form>
  </dialog>
</template>
<style></style>
