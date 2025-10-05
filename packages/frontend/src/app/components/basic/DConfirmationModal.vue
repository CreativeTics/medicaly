<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import DBtn from './DBtn.vue'
import { XIcon } from './icons'
import DTextAreaField from './DTextAreaField.vue'
const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    bottomColor?: 'primary' | 'success' | 'danger' | 'warning'
    requireReason?: boolean
  }>(),
  {
    isActive: true,
    title: 'Confirmar acción',
    message: '¿Está seguro de que desea continuar?',
    bottomColor: 'primary',
    requireReason: false,
  }
)

const emits = defineEmits(['close', 'confirm'])

const reason = ref('')

const closeModal = () => {
  emits('close')
}

const confirm = () => {
  // Lógica de confirmación
  if (props.requireReason && reason.value.length < 20) return
  emits('confirm', reason.value)
}

onMounted(async () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
})
</script>

<template>
  <div
    class="fixed w-screen h-screen p-10 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative w-full sm:w-1/2 md:w-1/3 bg-white rounded-2xl p-5">
      <div
        class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-gray-50 text-gray-500 p-3"
        @click="closeModal"
      >
        <XIcon class="w-6 h-6 cursor-pointer" />
      </div>
      <div
        class="w-full h-full flex flex-col items-stretch justify-center gap-2"
      >
        <span class="text-lg text-center font-semibold">{{ title }}</span>

        <hr class="divide-x-2" />
        <div class="text-sm text-center text-gray-500">
          {{ message }}
        </div>

        <DTextAreaField
          v-if="requireReason"
          v-model="reason"
          label="Justificación:"
          :placeholder="'Escriba la justificación mínimo 20 caracteres...'"
          :required="true"
          :rows="4"
          :error="
            reason.length < 20
              ? 'La justificación debe tener al menos 20 caracteres'
              : ''
          "
        />

        <div class="flex w-full justify-end mt-4 gap-2">
          <DBtn @click="closeModal" class="bg-gray-300 hover:bg-gray-400"
            >Cancelar</DBtn
          >
          <DBtn
            @click="confirm"
            class="text-white"
            :color="bottomColor"
            :disabled="requireReason && reason.length < 20"
            >Confirmar</DBtn
          >
        </div>
      </div>
    </div>
  </div>
</template>
