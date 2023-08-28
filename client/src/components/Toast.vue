<script setup lang="ts">
defineProps({
  message: String,
  icon: String,
});
</script>
<template>
  <div
    class="toast toast-top toast-center max-h-60 lg:max-h-none"
    v-if="message"
  >
    <label for="sign">
      <div>
        <div class="alert shadow-lg rounded-full text-xs lg:text-lg">
          {{ icon }}
          {{ message }}
        </div>
        <br />
      </div>
    </label>
  </div>
</template>
