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
  <div className="navbar bg-base-100">
    <div className="flex-1">
      <button class="btn btn-ghost btn-circle">
        <div class="indicator">
          <i class="fa-regular fa-bell text-lg"></i>
          <span class="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
    </div>
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <label tabIndex="{0}" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              src="https://api.dicebear.com/7.x/thumbs/svg?seed=Bob"
              alt="avatar"
            />
          </div>
        </label>
        <ul
          tabIndex="{0}"
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <label for="my-drawer-2" class="drawer-button cursor-pointer"
              >menu</label
            >
          </li>
          <li>
            <a className="justify-between"> Profile </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click="logOut">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Job</th>
          <th>Favorite Color</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr class="bg-base-200">
          <th>1</th>
          <td>Cy Ganderton</td>
          <td>Quality Control Specialist</td>
          <td>Blue</td>
        </tr>
        <!-- row 2 -->
        <tr>
          <th>2</th>
          <td>Hart Hagerty</td>
          <td>Desktop Support Technician</td>
          <td>Purple</td>
        </tr>
        <!-- row 3 -->
        <tr>
          <th>3</th>
          <td>Brice Swyre</td>
          <td>Tax Accountant</td>
          <td>Red</td>
        </tr>
      </tbody>
    </table>
  </div>

  <label for="my-drawer-2" class="drawer-button">
    <div class="drawer drawer-end">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div
        class="drawer-content flex flex-col items-center justify-center"
      ></div>
      <div class="drawer-side">
        <label for="my-drawer-2" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <!-- Sidebar content here -->
          <li><a>Sidebar Item 1</a></li>
          <li><a>Sidebar Item 2</a></li>
        </ul>
      </div>
    </div>
  </label>
</template>
