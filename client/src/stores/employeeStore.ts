import { ref } from "vue";
import { Employee } from "../types";

export const employee = ref<Employee>({
  _id: "",
  email: "",
  name: "",
  profilePicture: "",
  roles: [],
  teams: [],
});
