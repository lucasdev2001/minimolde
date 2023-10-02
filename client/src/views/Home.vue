<script lang="ts" setup>
import { ref } from "vue";

const isAvailable = ref(false);
</script>

<template>
  <main class="p-3 flex flex-col gap-3">
    <hgroup class="prose">
      <h2>Tasks</h2>
    </hgroup>

    <div class="divider"></div>

    <div class="join w-full">
      <div class="w-full">
        <div class="w-full">
          <input
            class="input input-bordered join-item w-full"
            placeholder="Search"
          />
        </div>
      </div>
      <select class="select select-bordered join-item">
        <option disabled selected>Filter</option>
        <option>Started</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <div class="indicator">
        <button class="btn join-item">Search</button>
      </div>
    </div>

    <div class="flex justify-between p-3 gap-3">
      <div class="border-t-2 border-t-green-500 basis-1/3 grow">
        <div class="uppercase flex justify-between">
          <h3 class="label-text">Just started</h3>
        </div>
        <div class="card w-full bg-base-100 border-2 card-compact">
          <div class="card-body">
            <div class="prose">
              <h2 class="card-title">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
            </div>
            <div class="card-actions justify-end">
              <input type="radio" name="radio-1" class="radio" checked />
              <input type="radio" name="radio-1" class="radio" />
              <input type="radio" name="radio-1" class="radio" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-t-2 border-t-black-500 basis-1/3 grow"
        v-if="isAvailable"
      >
        <hgroup class="prose uppercase flex p-3 justify-between">
          <h3 class="font-thin">Just started</h3>
          <i class="fa-solid fa-circle" style="color: black"></i>
        </hgroup>
        <div class="card w-full bg-base-100 border-2 card-compact">
          <div class="card-body">
            <div class="prose">
              <h2 class="card-title">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
            </div>
            <div class="card-actions justify-end">
              <input type="radio" name="radio-1" class="radio" checked />
              <input type="radio" name="radio-1" class="radio" />
              <input type="radio" name="radio-1" class="radio" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-t-2 border-t-black-500 basis-1/3 grow"
        v-if="isAvailable"
      >
        <hgroup class="prose uppercase flex p-3 justify-between">
          <h3 class="font-thin">Just started</h3>
          <i class="fa-solid fa-circle" style="color: black"></i>
        </hgroup>
        <div class="card w-full bg-base-100 border-2 card-compact">
          <div class="card-body">
            <div class="prose">
              <h2 class="card-title">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
            </div>
            <div class="card-actions justify-end">
              <input type="radio" name="radio-1" class="radio" checked />
              <input type="radio" name="radio-1" class="radio" />
              <input type="radio" name="radio-1" class="radio" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-primary" @click="isAvailable = !isAvailable">
      Button
    </button>
  </main>
</template>
