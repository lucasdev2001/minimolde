import { Ref } from "vue";

export default function handleApiResponseMessage(
  message: string,
  success: boolean,
  ref: Ref
) {
  ref.value = { message, success };
  setTimeout(() => {
    ref.value = null;
  }, 3000);
}
