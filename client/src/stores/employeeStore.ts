import { ref } from "vue";
import { Employee, Token } from "../types";
import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token");
let decoded;
if (token) {
  decoded = jwtDecode(token ?? "");
}

export const employee = ref<Employee>({
  _id: decoded ? (decoded as Token)._id : "",
  email: "",
  name: "",
  profilePicture: "",
  roles: [],
  teams: [],
});
