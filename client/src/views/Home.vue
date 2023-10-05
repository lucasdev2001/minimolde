<script lang="ts" setup>
import { ref } from "vue";

const isAvailable = ref(false);
</script>

<template>
  <main class="p-3 flex flex-col gap-3">
    <hgroup class="prose">
      <h2 class="font-thin text-xl">Team Gutenberg</h2>
    </hgroup>
    <div class="text-sm breadcrumbs">
      <ul>
        <li><a>Home</a></li>
        <li><a>Teams</a></li>
        <li>Team Gutenberg</li>
      </ul>
    </div>

    <div class="divider"></div>

    <div class="flex justify-between p-3 gap-3">
      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-success mb-3">In Progress</button>

          <div class="card w-full bg-base-100 border-2 card-compact">
            <div class="card-body">
              <div class="prose">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
              </div>
              <div class="card-actions justify-end">
                <div class="avatar-group -space-x-6">
                  <div class="avatar">
                    <div class="w-12">
                      <img
                        src="https://images.pexels.com/photos/18530726/pexels-photo-18530726/free-photo-of-garota-ruiva-em-um-vestido-vintage-verde-com-uvas.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div class="basis-1/3 grow" v-if="isAvailable">
          <button class="btn btn-warning mb-3">In Progress</button>

          <div class="card w-full bg-base-100 border-2 card-compact">
            <div class="card-body">
              <div class="prose">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
              </div>
              <div class="card-actions justify-end">
                <div class="avatar-group -space-x-6">
                  <div class="avatar">
                    <div class="w-12">
                      <img
                        src="https://images.pexels.com/photos/18530726/pexels-photo-18530726/free-photo-of-garota-ruiva-em-um-vestido-vintage-verde-com-uvas.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div class="basis-1/3 grow">
          <button class="btn btn-neutral mb-3">Completed</button>

          <div class="card bg-base-100 border-2 card-compact relative">
            <div class="card-body">
              <div class="dropdown dropdown-end absolute top-4 end-4">
                <label tabindex="0" class="link">
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </label>
                <ul
                  tabindex="0"
                  class="dropdown-content z-[1] menu p-2 shadow bg-base-100 w-52"
                >
                  <li><a>Item 1</a></li>
                  <li><a>Item 2</a></li>
                </ul>
              </div>
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
      </Transition>
    </div>

    <!-- Open the modal using ID.showModal() method -->
    <button class="btn" onclick="my_modal_1.showModal()">open modal</button>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Hello!</h3>
        <p class="py-4">Press ESC key or click the button below to close</p>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>

    <button class="btn btn-primary" @click="isAvailable = !isAvailable">
      Button
    </button>
  </main>
</template>

<style scoped>
@keyframes slideRight {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slideLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
.fade-enter-active {
  animation: slideRight 0.3s ease-in-out forwards;
}
.fade-leave-active {
  transition: opacity ease;
}

.fade-enter-from,
.fade-leave-to {
  animation: slideLeft 0.2s ease-in-out forwards;
}
</style>
