<script setup lang="ts">
import { Field } from './types'
import {
  Edit05Icon as EditIcon,
  Trash01Icon,
} from '@/app/components/basic/icons'
import DBtn from '@components/basic/DBtn.vue'
import DTextAreaField from '@components/basic/DTextAreaField.vue'
import { ref } from 'vue'

const props = defineProps<{
  modelValue: Field
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: Field): void
  (event: 'delete'): void
}>()

const updateModel = (value: Field) => {
  emit('update:modelValue', value)
}
const isEditing = ref(false)
const fieldText = ref('')

const handleEdit = () => {
  isEditing.value = true
  fieldText.value = JSON.stringify(props.modelValue, null, 2)
}
const inError = ref(false)
const validateSchema = () => {
  try {
    JSON.parse(fieldText.value)
    inError.value = false
  } catch (error) {
    inError.value = true
    console.error('Invalid JSON in fieldText:', error)
  }
}

const handleSave = () => {
  isEditing.value = false
  updateModel(JSON.parse(fieldText.value))
}

const handleDelete = () => {
  isEditing.value = false
  emit('delete')
}
</script>
<template>
  <div v-if="!isEditing" class="flex items-center gap-2">
    <div
      class="bg-blue-50 rounded-full p-2 absolute -right-2 -top-2 hover:scale-110"
      @click="handleEdit"
    >
      <EditIcon class="h-5 w-5 cursor-pointer text-blue-700" />
    </div>
  </div>

  <div
    v-else
    class="fixed z-50 w-full bg-white rounded-2xl p-2 flex flex-col gap-2"
    :class="{ ' border-2 border-red-500 ': inError }"
  >
    <div
      class="absolute -right-2 -top-2 bg-red-100 text-red-700 rounded-full p-2 hover:scale-110"
      @click="handleDelete"
      title="Eliminar Campo"
    >
      <Trash01Icon class="h-5 w-5 cursor-pointer" />
    </div>
    <DTextAreaField
      v-model="fieldText"
      :label="props.modelValue.label"
      :rows="10"
      class="w-full"
      @update:model-value="validateSchema"
    />

    <div class="flex justify-end gap-1">
      <DBtn color="disabled" @click="isEditing = false">Cancelar</DBtn>
      <DBtn
        :disabled="inError"
        :class="[
          inError
            ? 'bg-red-500 text-white hover:bg-red-700 focus:ring-red-500 cursor-pointer'
            : 'bg-green-500 text-white hover:bg-green-700 focus:ring-green-500 cursor-pointer',
        ]"
        @click="handleSave"
        >Guardar Campo</DBtn
      >
    </div>
  </div>
</template>
