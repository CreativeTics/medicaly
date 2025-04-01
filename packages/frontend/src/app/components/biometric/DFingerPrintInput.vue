<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFingerprint, DeviceStatus } from './use-fingerprint'
import { Fingerprint03Icon } from '../basic/icons'

const props = defineProps<{
  modelValue: string
}>()

const takePhoto = () => {
  image.value = fingerprintImage.value
  emitValue()
}

const { deviceStatus, startAcquisition, fingerprintImage } =
  useFingerprint(takePhoto)

const emit = defineEmits(['update:modelValue'])

const error = ref<string>('')
const image = ref<string>('')

onMounted(() => {
  image.value = props.modelValue
})

const emitValue = () => {
  emit('update:modelValue', image.value)
}
</script>

<template>
  <div
    class="w-full flex justify-center items-center rounded-lg bg-amber-50 border-2 border-dashed overflow-hidden relative"
    :class="{
      'border-green-400': deviceStatus === DeviceStatus.Connected,
      'border-red-400': deviceStatus === DeviceStatus.Disconnected,
      'border-blue-600': deviceStatus === DeviceStatus.GettingSamples,
    }"
  >
    <div class="w-full flex justify-center items-center">
      <span v-if="error">
        {{ error }}
      </span>

      <div
        v-if="
          !error &&
          !(image || fingerprintImage) &&
          deviceStatus === DeviceStatus.Connected
        "
        class="text-gray-500 h-20 flex items-center"
      >
        No se ha tomado la huella
      </div>
      <div
        v-if="
          !error &&
          !(image || fingerprintImage) &&
          deviceStatus === DeviceStatus.Disconnected
        "
        class="text-gray-500 h-20 flex flex-col items-center justify-center"
      >
        Huellero desconectado
        <br />
        <a
          href="/driver/DPClient.exe"
          class="text-blue-500 hover:text-blue-700 flex"
          download
        >
          Descargar driver
          <Download01Icon class="h-6 w-6 mx-2 cursor-pointer" />
        </a>
      </div>
      <div
        v-if="
          !error &&
          !(image || fingerprintImage) &&
          deviceStatus === DeviceStatus.GettingSamples
        "
        class="text-gray-500 h-20 flex items-center"
      >
        Esperando huella...
      </div>

      <img
        v-show="!error && (image || fingerprintImage)"
        :src="image || fingerprintImage"
        alt="Huella digital"
      />
    </div>
    <div
      v-if="!error && deviceStatus === DeviceStatus.Connected"
      class="flex flex-col justify-center absolute right-0"
    >
      <div
        v-if="deviceStatus === DeviceStatus.Connected"
        title="Iniciar toma de huella"
        class="bg-gray-100 hover:bg-white rounded-full py-2"
        @click="startAcquisition(5)"
      >
        <Fingerprint03Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
      </div>
    </div>
  </div>
</template>
