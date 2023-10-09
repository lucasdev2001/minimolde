<script lang="ts" setup>
import { useRoute } from "vue-router";
import Task from "../components/teams/Task.vue";
import { onBeforeMount, ref } from "vue";
import { Team } from "../types";
import axios from "axios";
import startCase from "lodash/startCase";

const route = useRoute();
const team = ref<Team>({
  name: "",
  description: "",
  employees: [],
});
const teamName = (route.params.team as string).replace(/-/g, " ");
onBeforeMount(async () => {
  const response = await axios.get(
    import.meta.env.VITE_API_ADDRES_FIND_ONE_TEAM + startCase(teamName)
  );
  team.value = response.data as Team;
});
</script>

<template>
  <main class="flex flex-col gap-3 p-3">
    <div class="flex flex-row justify-between">
      <hgroup class="prose font-thin">
        <h1 class="font-thin m-0">{{ team.name }}</h1>
        <h2 class="font-thin m-0">{{ team.description }}</h2>
      </hgroup>
      <div>
        <div class="avatar-group -space-x-6">
          <template v-for="employee in [...team.employees].slice(0, 5)">
            <div class="avatar">
              <div class="w-12">
                <img :src="employee.profilePicture" />
              </div>
            </div>
          </template>

          <div class="avatar placeholder" v-if="team.employees.length > 5">
            <div class="w-12 bg-neutral-focus text-neutral-content">
              <span>+5</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <div class="flex justify-between gap-3">
      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-success mb-3">Just Started</button>
          <Task />
        </div>
      </Transition>
      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-warning mb-3">In Progress</button>
          <Task />
        </div>
      </Transition>
      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-neutral mb-3">Completed</button>
          <Task />
        </div>
      </Transition>
    </div>
  </main>
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

.fade-enter-from,
.fade-leave-to {
  animation: slideLeft 0.2s ease-in-out forwards;
}
</style>
