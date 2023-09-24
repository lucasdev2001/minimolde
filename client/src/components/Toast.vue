<script setup lang="ts">
defineProps({
  message: String,
  icon: String,
});
</script>
<template>
  <div class="toast toast-top toast-center" v-if="message">
    <label for="sign">
      <div>
        <div class="alert shadow-2xl rounded-full">
          {{ icon }}
          {{ message }}
        </div>
        <br />
      </div>
    </label>
  </div>
</template>
