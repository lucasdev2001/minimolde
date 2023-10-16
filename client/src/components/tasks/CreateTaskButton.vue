<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import handleApiResponseMessage from "../../utils/handleApiResponseMessage";

//refs
const apiResponseMessage = ref<{
  message: string;
  success: boolean;
} | null>();
const assignedToRadioInput = ref("");

//functions

const handleCreateTask = async (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  const axiosConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  try {
    const response = await axios.post(
      import.meta.env.VITE_API_TASKS,
      formJson,
      axiosConfig
    );

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
</script>
<template>
  <button class="btn btn-primary join-item" @click="createTaskModalToggle">
    CREATE TASK
    <i class="fa-solid fa-add"></i>
  </button>

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
