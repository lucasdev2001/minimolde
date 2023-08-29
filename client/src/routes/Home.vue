<script lang="ts" setup>
import { useRouter } from "vue-router";
import jwt from "jsonwebtoken";
import { ref } from "vue";
import { onKeyStroke } from "@vueuse/core";

import { useDraggable } from "@vueuse/core";

onKeyStroke("F1", e => {
  console.log("pressed");

  e.preventDefault();
});

const el = ref<HTMLElement | null>(null);
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
});

if (x.value > 0) {
  console.log("open");
} else {
  console.log("close");
}

interface Employee {
  email: string;
  name: string;
}

const router = useRouter();

const token = localStorage.getItem("token")!;
const employee = jwt.decode(token) as Employee;
const badge = ref(null);

const logOut = () => {
  localStorage.removeItem("token");
  router.push({ name: "Login" });
};
</script>

<template>
  <h1>{{ employee.email }}</h1>
  <div ref="el" :style="style" style="position: fixed">
    Drag me! I am at {{ x }}, {{ y }}
  </div>
  <div class="badge badge-primary" ref="badge">primary</div>

  <div class="card w-96 bg-base-100 shadow-xl">
    <figure>
      <img
        src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
        alt="Shoes"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">
        Shoes!
        <div class="badge badge-secondary">NEW</div>
      </h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div class="card-actions justify-end">
        <div class="badge badge-outline">Fashion</div>
        <div class="badge badge-outline">Products</div>
      </div>
    </div>
  </div>
</template>
