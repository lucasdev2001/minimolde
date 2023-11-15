import { apiResponse } from "../stores/apiResponse";

export default function handleResponseMessage(
  message: string,
  success: boolean
) {
  apiResponse.value = { message, success };
  setTimeout(() => {
    apiResponse.value = null;
  }, 3000);
}
