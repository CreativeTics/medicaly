<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DBtn, DTextField } from '@/app/components/basic'
import { XIcon } from '@/app/components/basic/icons'

const props = withDefaults(
  defineProps<{
    title?: string
    recordName: string
    label?: string
  }>(),
  {
    title: 'Eliminar registro',
    label: 'nombre del registro',
  }
)

const emit = defineEmits(['close', 'confirm'])

const confirmationText = ref('')

const canConfirm = computed(() => {
  return confirmationText.value === props.recordName
})

const closeModal = () => {
  confirmationText.value = ''
  emit('close')
}

const confirm = () => {
  if (!canConfirm.value) return
  emit('confirm')
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
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
          Esta acción no se puede deshacer. Para confirmar, escriba el
          {{ label }}:
        </div>
        <div class="text-sm text-center font-semibold text-red-600 py-1">
          {{ recordName }}
        </div>
        <DTextField
          v-model="confirmationText"
          label=""
          :placeholder="`Escriba el ${label}`"
          id="confirmDeleteName"
          :error="
            confirmationText.length > 0 && !canConfirm
              ? 'El nombre no coincide'
              : ''
          "
        />
        <div class="flex w-full justify-end mt-4 gap-2">
          <DBtn @click="closeModal" class="bg-gray-300 hover:bg-gray-400">
            Cancelar
          </DBtn>
          <DBtn
            @click="confirm"
            class="text-white"
            color="danger"
            :disabled="!canConfirm"
          >
            Eliminar
          </DBtn>
        </div>
      </div>
    </div>
  </div>
</template>
