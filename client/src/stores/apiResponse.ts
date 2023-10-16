import { ref } from "vue";

export const apiResponse = ref<{
  message: string;
  success: boolean;
} | null>(null);
