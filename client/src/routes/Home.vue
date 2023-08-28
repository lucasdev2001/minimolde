<script lang="ts" setup>
import { useRouter } from "vue-router";
import jwt from "jsonwebtoken";

interface Employee {
  email: string;
  name: string;
}

const router = useRouter();

const token = localStorage.getItem("token")!;
const employee = jwt.decode(token) as Employee;

const logOut = () => {
  localStorage.removeItem("token");
  router.push({ name: "Login" });
};
</script>

<template>
  <h1>{{ employee.email }}</h1>
</template>
