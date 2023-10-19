import { apiResponse } from "../stores/apiResponse";

export default function handleApiResponseMessage(
  message: string,
  success: boolean
) {
  apiResponse.value = { message, success };
  setTimeout(() => {
    apiResponse.value = null;
  }, 3000);
}
