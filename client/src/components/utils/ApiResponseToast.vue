<script setup lang="ts">
import { apiResponse } from "../../stores/apiResponse";
</script>
<template>
  <div class="toast toast-top toast-center z-50" v-if="apiResponse">
    <div>
      <div class="alert shadow-2xl rounded-full">
        {{ apiResponse.success ? "✅" : "❌" }}
        {{ apiResponse.message }}
      </div>
      <br />
    </div>
  </div>
</template>
