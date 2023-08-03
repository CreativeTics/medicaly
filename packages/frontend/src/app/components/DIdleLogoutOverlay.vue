<template>
  <div
    class="fixed z-30 h-screen w-screen grid place-items-center"
    style="background-color: rgba(0, 0, 0, 0.3)"
    :class="isIdle ? '' : 'hidden'"
    @mousemove="restore"
  >
    <div
      class="z-50 w-1/2 lg:w-1/4 h-2/6 xl:h-1/4 p-10 bg-white rounded-lg flex flex-col shadow-lg"
    >
      <div class="text-2xl p-2">Parece que estas ausente!</div>
      <hr />
      <div class="text-sm text-slate-500 p-2">
        Tu sesion se cerrara al finalizar el tiempo, si desea continuar mueva el
        mouse sobre la pantalla.
      </div>
      <div class="z-50 text-4xl text-red-700 grid place-items-center p-5">
        <v-idle
          :reminders="[120]"
          :duration="900"
          @idle="onIdle"
          @remind="onRemind"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../store/auth";
import { useRouter } from "vue-router";

const store = useAuthStore();
const router = useRouter();

const isIdle = ref(false);
const onIdle = () => {
  store.logout();
  router.push({ name: "login" });
};

const onRemind = () => {
  isIdle.value = true;
};
const restore = () => {
  isIdle.value = false;
};
</script>
