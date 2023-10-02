<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
console.log(router.getRoutes());
</script>
<template>
  <ul
    class="menu menu-horizontal bg-base-100 absolute bottom-0 w-full flex place-items-center justify-evenly"
  >
    <li>
      <a class="active">
        <i class="fa-solid fa-house"></i>
      </a>
    </li>
    <li>
      <a class="focus">
        <i class="fa-solid fa-plus"></i>
      </a>
    </li>
    <li><a class="focus">Files</a></li>
  </ul>
</template>
