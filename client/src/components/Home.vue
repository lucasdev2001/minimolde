<script lang="ts" setup>
import * as mqtt from "mqtt";
import { onBeforeUnmount } from "vue";
const client = mqtt.connect("WS://127.0.0.1:8888", {});
onBeforeUnmount(() => {
  client.end();
});

client.subscribe(["presence/update"]);

const handlePresence = (message: string) => {
  console.log(message);
};

client.on("message", (topic, message) => {
  switch (topic) {
    case "presence/update":
      handlePresence(message);
      console.log(topic.split("/")[1]);

      break;

    default:
      break;
  }
});

function handleButton() {
  client.publish("presence:delete", "teste", error => console.log(error));
}
</script>

<template>
  <div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="w-full navbar bg-base-300">
        <div class="flex-none lg:hidden">
          <label for="my-drawer-3" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-6 h-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div class="flex-1 px-2 mx-2">Navbar Title</div>
        <div class="flex-none hidden lg:block">
          <ul class="menu menu-horizontal">
            <!-- Navbar menu content here -->
            <li><a>Navbar Item 1</a></li>
            <li><a>Navbar Item 2</a></li>
          </ul>
        </div>
      </div>
      <!-- Page content here -->
      Content
    </div>
    <div class="drawer-side">
      <label for="my-drawer-3" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 h-full bg-base-200">
        <!-- Sidebar content here -->
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>

  <button class="btn btn-neutral" @click="handleButton">clicka-me</button>
</template>
