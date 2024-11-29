<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notifications'
import { EyeIcon, EyeOffIcon } from '@components/basic/icons'
import { DTextField, DBtn } from '@components/basic'
const router = useRouter()
const notificationsStore = useNotificationsStore()

import { login } from '../services'

const show = ref(true)
const loading = ref(false)
const wrongData = ref('')

const dataLogin = ref({
  userName: '',
  userPassword: '',
})

const errors = ref({
  userName: '',
  userPassword: '',
})

const handleLogin = async () => {
  console.log('login')
  loading.value = true
  const isLogged = await login(
    dataLogin.value.userName,
    dataLogin.value.userPassword
  )
  if (isLogged) {
    router.push({ name: 'Home' })
  } else {
    notificationsStore.addNotification({
      title: 'Error',
      text: 'Usuario o contraseña incorrectos',
      type: 'error',
    })
  }

  loading.value = false
}
</script>
<template>
  <h2 class="text-3xl xl:text-4xl font-bold">Inicio de Sesión</h2>
  <p class="py-3 text-gray-400 text-md md:text-lg leading-6">
    Bienvenido de nuevo! <small>ingresa tus datos de acceso.</small>
  </p>
  <div
    v-if="wrongData"
    class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
    role="alert"
  >
    <p class="text-sm font-bold">{{ wrongData }}</p>
  </div>
  <div class="grid">
    <div class="grid mb-3">
      <DTextField
        label="Usuario"
        type="text"
        :error="errors.userName"
        placeholder="Ingresa tu nombre de usuario "
        :required="true"
        v-model="dataLogin.userName"
        @keydown.enter="handleLogin"
      />
    </div>
    <div class="grid relative mb-3">
      <DTextField
        label="Contraseña"
        :type="show ? 'password' : 'text'"
        :error="errors.userPassword"
        placeholder="Ingresa tu contraseña"
        :required="true"
        v-model="dataLogin.userPassword"
        @keydown.enter="handleLogin"
      />
      <div class="absolute right-3 top-8 z-50">
        <EyeIcon
          class="text-gray-600"
          @click="show = !show"
          :class="{ hidden: !show, block: show }"
        ></EyeIcon>
        <EyeOffIcon
          class="text-gray-600"
          @click="show = !show"
          :class="{ block: !show, hidden: show }"
        ></EyeOffIcon>
      </div>
    </div>
    <div class="flex justify-between pt-4 pb-6"></div>
    <DBtn
      class="font-semibold py-3 text-base"
      :loading="loading"
      @click="handleLogin"
    >
      Iniciar sesión
    </DBtn>
  </div>
</template>
