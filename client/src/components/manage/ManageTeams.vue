<script setup lang="ts"></script>
<template>
  <main class="flex flex-col p-3">
    <div class="flex flex-row justify-between">
      <hgroup class="prose font-thin">
        <h1 class="font-thin m-0">Hi {{ employee.name }} 👋</h1>
        <h2 class="font-thin m-0">Manage your teams</h2>
      </hgroup>
    </div>

    <div class="divider"></div>

    <div class="text-end">
      <button class="btn btn-primary" @click="createTaskModalToggle">
        Create Task
      </button>
    </div>

    <br /><br />
  </main>
</template>
