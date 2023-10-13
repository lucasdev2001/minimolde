<script lang="ts" setup>
defineProps({
  title: String,
  description: String,
});
defineEmits(["test"]);
</script>
<template>
  <div class="card bg-base-100 border-2 card-compact relative">
    <div class="card-title justify-end"></div>
    <div class="card-body">
      <div class="dropdown dropdown-end absolute top-4 end-4">
        <label tabindex="0" class="link">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </label>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 w-52"
        >
          <li><a @click="$emit('test', 1)">started</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
      <div class="prose">
        <h2 class="card-title">{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
    </div>
    <div class="card-actions justify-end border-t-2 pt-3">
      <div class="avatar-group -space-x-6">
        <div class="avatar">
          <div class="w-12">
            <img src="../../assets/logo.svg" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-12">
            <img src="../../assets/logo.svg" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-12">
            <img src="../../assets/logo.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
