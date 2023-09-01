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
  <nav className="navbar bg-base-100">
    <div className="navbar-start">
      <button class="btn btn-ghost btn-circle">
        <div class="indicator">
          <i class="fa-regular fa-bell text-lg"></i>
          <span class="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
    </div>

    <div className="navbar-end">
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
            <label for="drawer" class="drawer-button cursor-pointer"
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
  </nav>

  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead class="bg-base-200">
        <tr>
          <th></th>
          <th>Name</th>
          <th>Job</th>
          <th>Favorite Color</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr class="hover:bg-base-200">
          <th>1</th>
          <td>Cy Ganderton</td>
          <td>Quality Control Specialist</td>
          <td>Blue</td>
        </tr>
        <!-- row 2 -->
        <tr class="hover:bg-base-200">
          <th>2</th>
          <td>Hart Hagerty</td>
          <td>Desktop Support Technician</td>
          <td>Purple</td>
        </tr>
        <!-- row 3 -->
        <tr class="hover:bg-base-200">
          <th>3</th>
          <td>Brice Swyre</td>
          <td>Tax Accountant</td>
          <td>Red</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="drawer drawer-end">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center"></div>
    <div class="drawer-side">
      <label for="drawer" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <label for="drawer" class="drawer-button">
          <li>
            <a>
              <i class="fa-solid fa-list-check"></i>
              tasks
            </a>
          </li>
        </label>
        <label for="drawer" class="drawer-button">
          <li>
            <a>
              <i class="fa-solid fa-box-archive"></i>
              files
            </a>
          </li>
        </label>
      </ul>
    </div>
  </div>
</template>
