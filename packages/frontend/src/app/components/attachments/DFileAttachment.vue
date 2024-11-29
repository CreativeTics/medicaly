<script setup lang="ts">
import {
  UploadCloud01Icon,
  File06Icon,
  Loading01Icon,
  Trash01Icon,
  Download01Icon,
} from '../basic/icons'
import { ref, watch } from 'vue'

import { useFileAttachment } from '../../core/composable/useFileAttachment'

const { actualFileName, saveTemp, deleteFile, downloadFile, loadFile } =
  useFileAttachment('temp')

const props = withDefaults(
  defineProps<{
    label: string
    modelValue: string | undefined // fileId
    helpText?: string
    accept?: string // 'application/pdf'
    disabled?: boolean
    required?: boolean
    error?: string
  }>(),
  {
    label: '',
    helpText: 'Carga tu archivo',
    accept: '*',
    disabled: true,
    required: false,
    error: '',
  }
)
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const emit = defineEmits(['update:modelValue'])

const emitUpdate = (val: any) => {
  console.log(val)
  emit('update:modelValue', val)
}

const selectFile = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

const inputFileChange = (e: any) => {
  const files = e.target.files
  if (files.length > 0) {
    const file = files[0]
    if (file.type.match(props.accept)) {
      onFileChange(file)
    }
    // emitUpdate(e)
  }
}

const onFileChange = async (file: any) => {
  console.log(file)
  isLoading.value = true
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = async (e) => {
    const data = _arrayBufferToBase64(e.target?.result)
    // saveTemp(data, file.name)
    const fileId = await saveTemp(file.name, file.type, data)

    emitUpdate(fileId)
    isLoading.value = false
  }
}

const _arrayBufferToBase64 = (buffer: any) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

const handleDeleteFile = () => {
  isLoading.value = true
  if (props.modelValue) {
    deleteFile(props.modelValue)
    emit('update:modelValue', '')
  }
  isLoading.value = false
}

const handleDownloadFile = async () => {
  isLoading.value = true
  if (props.modelValue) {
    const file = await downloadFile(props.modelValue)
    console.log(file)
    const byteCharacters = atob(file.data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    // file.data is a base64 string
    const blob = new Blob([byteArray], { type: file.type })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.click()
  }
  isLoading.value = false
}

watch(
  () => props.modelValue,
  (newVal: string | undefined) => {
    if (newVal && actualFileName.value === '') {
      isLoading.value = true
      loadFile(newVal)
      isLoading.value = false
    }
  }
)
</script>

<template>
  <div>
    <div class="w-full min-w-full">
      <label class="block text-sm font-medium text-gray-700 mb-1.5"
        >{{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <div
        v-if="isLoading"
        class="flex justify-between items-center w-full h-full gap-1"
      >
        <div
          class="flex flex-1 justify-start items-center rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-gray-100 h-10 cursor-pointer"
        >
          <span class="flex text-blue-800">
            <Loading01Icon class="h-6 w-6 mx-2 animate-spin" /> Espere por
            favor...
          </span>
        </div>
      </div>
      <div v-else class="flex justify-between items-center w-full h-full gap-1">
        <div
          class="flex flex-1 justify-start items-center rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-gray-100 h-10 cursor-pointer"
          @click="selectFile"
          :disabled="disabled"
          :class="[
            { error },
            { 'bg-gray-200': disabled, 'pointer-events-none': disabled },
          ]"
        >
          <span v-if="modelValue" class="flex text-blue-800">
            <File06Icon class="h-6 w-6 mx-2" />
            {{ actualFileName }}
          </span>
          <span v-else class="flex">
            <UploadCloud01Icon class="mx-2 h-6 w-6 text-gray-300" />
            {{ helpText }}
          </span>
          <input
            v-if="!disabled"
            ref="fileInput"
            type="file"
            class="opacity-0 hidden"
            :accept="accept"
            @change="inputFileChange"
          />
        </div>

        <div
          v-if="modelValue !== ''"
          class="bg-gray-50 rounded-md py-2"
          @click="handleDownloadFile"
          :disabled="disabled"
          :color="disabled ? 'disabled' : 'default'"
        >
          <Download01Icon
            title="Descargar archivo"
            class="h-6 w-6 mx-2 cursor-pointer text-blue-500"
          />
        </div>

        <div
          v-if="modelValue !== ''"
          class="bg-gray-50 rounded-md py-2"
          @click="handleDeleteFile"
          :disabled="disabled"
          :color="disabled ? 'disabled' : 'default'"
        >
          <Trash01Icon
            title="Eliminar archivo"
            class="h-6 w-6 mx-2 cursor-pointer text-red-600"
            @click="handleDeleteFile"
          />
        </div>
      </div>
      <span class="text-xs text-red-500">{{ error }}</span>
    </div>
  </div>
</template>
