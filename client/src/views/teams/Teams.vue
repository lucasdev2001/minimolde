<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { Team } from "../../types";
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
    import.meta.env.VITE_API_TEAM + startCase(teamName)
  );
  team.value = response.data as Team;
  console.log(team.value.employees);
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
  </main>
</template>
