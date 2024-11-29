<script setup lang="ts">
import { XIcon } from '@components/basic/icons'
import { DTextField } from '@components/basic'

import { useNotificationsStore } from '@/store/notifications'
import { useAuthStore } from '@/store/auth'

import { useValidation } from '@/app/core/composable/validation'
import { changePassword } from '../services'
const notifications = useNotificationsStore()
const authStore = useAuthStore()
const {
  model,
  validationSchema,
  handleValidation,
  addValidation,
  setInitialModel,
} = useValidation()

setInitialModel({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

addValidation('currentPassword', ['required'])
addValidation('newPassword', ['required', 'minlength:6'])
addValidation('confirmPassword', ['required', 'minlength:6'])

const handleSubmit = async () => {
  if (model.newPassword !== model.confirmPassword) {
    notifications.addNotification({
      title: 'Contraseñas no coinciden',
      text: 'Las contraseñas no coinciden',
      type: 'error',
      time: 10000,
    })
    return
  }

  if (handleValidation()) {
    if (!authStore.user?.id) return
    try {
      await changePassword(
        authStore.user?.id,
        model.currentPassword,
        model.newPassword
      )
      notifications.addNotification({
        title: 'Contraseña cambiada',
        text: 'La contraseña ha sido cambiada con éxito!',
        type: 'success',
        time: 10000,
      })
      emit('close')
    } catch (error: any) {
      notifications.addNotification({
        title: 'Error al cambiar contraseña',
        text: error.message,
        type: 'error',
        time: 10000,
      })
    }
  } else {
    notifications.addNotification({
      title: 'Campos obligatorios',
      text: 'Faltan campos obligatorios por completar',
      type: 'error',
      time: 10000,
    })
  }
}

const emit = defineEmits(['close'])
</script>

<template>
  <div
    class="fixed w-screen h-screen p-10 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="relative w-full sm:w-2/3 lg:w-1/3 xl:w-1/5 bg-white rounded-2xl p-5"
    >
      <div
        class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-white text-gray-500 p-3 hover:scale-105 transition-transform"
        @click="emit('close')"
      >
        <XIcon class="w-6 h-6 cursor-pointer" />
      </div>
      <div class="w-full h-full flex flex-col justify-stretch">
        <h1 class="text-2xl font-bold text-center text-gray-800">
          Cambiar contraseña
        </h1>

        <DTextField
          v-model="model.currentPassword"
          :required="true"
          label="Contraseña actual"
          type="password"
          class="mt-5"
          :error="validationSchema.currentPassword.errors.join(', ')"
          @update:model-value="handleValidation"
        />
        <DTextField
          v-model="model.newPassword"
          :required="true"
          label="Contraseña nueva"
          type="password"
          class="mt-5"
          :error="validationSchema.newPassword.errors.join(', ')"
          @update:model-value="handleValidation"
        />
        <DTextField
          v-model="model.confirmPassword"
          :required="true"
          label="Confirmar contraseña"
          type="password"
          class="mt-5"
          :error="validationSchema.confirmPassword.errors.join(', ')"
          @update:model-value="handleValidation"
        />

        <div class="w-full mt-5">
          <button
            class="w-full bg-blue-500 text-white rounded-md p-2 hover:scale-105 transition-transform"
            @click="handleSubmit"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
