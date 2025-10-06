<template>
  <div
    class="fixed z-30 h-screen w-screen grid place-items-center"
    style="background-color: rgba(0, 0, 0, 0.3)"
    :class="isRemind ? '' : 'hidden'"
  >
    <div
      class="z-50 w-1/2 lg:w-1/4 h-2/6 xl:h-1/4 p-10 bg-white rounded-lg flex flex-col shadow-lg"
    >
      <div class="text-2xl p-2">Parece que estas ausente!</div>
      <hr />
      <div class="text-sm text-slate-500 p-2">
        Tu sesión se cerrará al finalizar el tiempo, si deseas continuar mueve
        el mouse sobre la pantalla.
      </div>
      <div class="z-50 text-4xl text-red-700 grid place-items-center p-5">
        <div
          class="w-full flex justify-center items-center text-4xl text-slate-500 p-2"
        >
          {{ display.minutes }}:{{ display.seconds }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'

import { useIdle } from '@/app/core/composable'

const store = useAuthStore()
const router = useRouter()
// 15 minutes idle,  after 12 minutes remind
const { display, isRemind } = useIdle(900, 720, onIdle)

function onIdle() {
  store.logout()
  router.push('/')
}
</script>
