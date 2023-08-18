<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useFingerprint, DeviceStatus } from './use-fingerprint'
import { Camera03Icon, Repeat04Icon, Download01Icon } from '../basic'

const props = defineProps<{
  modelValue: string
}>()

const { deviceStatus, enumerateDevices, startAcquisition } = useFingerprint()

const emit = defineEmits(['update:modelValue'])

const error = ref<string>('')
const image = ref<string>('')
const tempImage = ref<string>('')

onMounted(() => {
  image.value = props.modelValue
  error.value = 'No se encontro Huellero'
})

const takePhoto = () => {
  image.value = tempImage.value
  emitValue()
}

const clearPhoto = () => {
  image.value = ''
}

const emitValue = () => {
  emit('update:modelValue', image.value)
}

onBeforeUnmount(() => {
  console.log('unmounted')
})
</script>

<template>
  <div
    class="w-full flex justify-center items-center rounded-lg bg-amber-50 border-2 border-dashed overflow-hidden relative"
    :class="{
      'border-green-200': deviceStatus === DeviceStatus.Connected,
      'border-red-200': deviceStatus === DeviceStatus.Disconnected,
    }"
  >
    <div class="w-full h-full flex justify-center items-center">
      <span v-if="error">
        {{ deviceStatus }}
        {{ error }}

        <a
          href="/driver/DPClient.exe"
          class="text-blue-500 hover:text-blue-700 flex"
          download
          >Descargar driver
          <Download01Icon class="h-6 w-6 mx-2 cursor-pointer" />
        </a>
        <Repeat04Icon
          class="h-6 w-6 mx-2 cursor-pointer"
          @click="enumerateDevices"
        />
        <Repeat04Icon
          class="h-6 w-6 mx-2 cursor-pointer"
          @click="startAcquisition"
        />
      </span>
      <img
        v-show="!error && (image || tempImage)"
        :src="image || tempImage"
        alt=""
      />
    </div>
    <div
      v-if="!error && deviceStatus === DeviceStatus.Connected"
      class="flex flex-col justify-center absolute right-0"
    >
      <div
        v-if="!image"
        title="Tomar huella"
        class="bg-gray-100 hover:bg-white rounded-full py-2"
        @click="takePhoto"
      >
        <Camera03Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
      </div>

      <div
        v-if="image"
        title="Tomar nuevamente"
        class="bg-gray-100 hover:bg-white rounded-full py-2"
        @click="clearPhoto"
      >
        <Repeat04Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
      </div>
    </div>
  </div>
</template>
