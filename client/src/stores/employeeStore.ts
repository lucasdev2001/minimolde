import { ref } from "vue";
import { Employee, Token } from "../types";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const employee = ref<Employee>({
  _id: "",
  email: "",
  name: "",
  profilePicture: "",
  roles: [],
  teams: [],
});
