<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import { Camera03Icon, Repeat04Icon } from './basic/icons'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const devices = ref<MediaDeviceInfo[]>([])
const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const selectedDevice = ref<MediaDeviceInfo | null>(null)
const error = ref<string>('')
const image = ref<string>('')
// let resolution = {
//   width: 1920,
//   height: 1920,
// }

let stream: MediaStream | null = null

const getDevices = async () => {
  const allDevices = await navigator.mediaDevices.enumerateDevices()
  devices.value = allDevices.filter((device) => device.kind === 'videoinput')
  selectedDevice.value = devices.value[0]
  if (!selectedDevice.value) {
    error.value = 'No se encontro camara'
    return
  }
  // set stream
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: selectedDevice.value.deviceId,
      // width: resolution.width,
      // height: resolution.height,
    },
  })
  if (video.value === null) return
  // resolution.width = video.value.clientWidth
  // resolution.height = video.value.clientHeight
  video.value.srcObject = stream
  video.value?.play()
}

onMounted(async () => {
  if (!navigator.mediaDevices) {
    error.value = 'No se encontro camara'
    return
  }
  navigator.mediaDevices.ondevicechange = getDevices
  await getDevices()
  image.value = props.modelValue
})

const takePhoto = () => {
  if (video.value === null || canvas.value === null) return
  canvas.value.width = video.value.clientWidth
  canvas.value.height = video.value.clientHeight

  const context = canvas.value?.getContext('2d') as CanvasRenderingContext2D
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  const data = canvas.value.toDataURL('image/png')
  image.value = data
  emitValue()
}

const clearPhoto = () => {
  image.value = ''
}

const emitValue = () => {
  emit('update:modelValue', image.value)
}

onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }
  if (navigator.mediaDevices?.ondevicechange)
    navigator.mediaDevices.ondevicechange = null
})
</script>

<template>
  <div
    class="w-full flex justify-center items-center rounded-lg bg-amber-50 border-2 border-dashed overflow-hidden relative"
  >
    <div class="flex justify-center items-center" id="camera-container">
      <span v-if="error">
        {{ error }}
      </span>
      <video v-show="!error && !image" autoplay ref="video" id="video"></video>
      <img v-show="!error && image" :src="image" alt="" />
    </div>
    <div
      class="flex flex-col justify-center absolute border-2 border-gray-50 rounded-full h-32 w-32 opacity-50"
    ></div>
    <div v-if="!error" class="flex flex-col justify-center absolute right-0">
      <div
        v-if="!image"
        title="Tomar foto"
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
    <canvas ref="canvas" id="canvas"> </canvas>
  </div>
</template>

<style scoped>
#camera-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 50px;
}

#slot-container {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

#video {
  width: 100%;
  height: 100%;
}

#canvas {
  display: none;
}
</style>
