<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'

import { Camera03Icon, Repeat04Icon } from '../basic/icons'
import { WS_URL } from '@/config'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

let socket: Socket | null = null
const code = ref<string>('')
const wsStatus = ref('disconnected')
const error = ref<string>('')
const image = ref<string>('')
const tempImage = ref<string>('')

onMounted(() => {
  image.value = props.modelValue
  code.value = localStorage.getItem('signature-pad-code') || getNewCode()
  connect()
  if (!props.modelValue) {
    socket?.emit('message', {
      type: 'unlock',
      room: code.value,
    })
  }
})

const getNewCode = () => {
  code.value = Math.floor(Math.random() * 999999).toString()
  localStorage.setItem('signature-pad-code', code.value)
  return code.value
}

const connect = () => {
  socket = io(`${WS_URL}/signature-pad`)
  socket.on('connect', () => {
    console.log('Pad connected')
    wsStatus.value = 'connected'
    if (socket) socket.emit('join', code.value)
  })
  socket.on('disconnect', () => {
    console.log('disconnected')
    wsStatus.value = 'disconnected'
  })
  socket.on('joined', (room) => {
    console.log(`joined to  ${room}`)
    wsStatus.value = 'joined'
  })
  socket.on('error', (error) => {
    console.error(error)
    wsStatus.value = 'error'
    error.value = error
  })

  socket.on('message', (message) => {
    if (message.type === 'signature-update') {
      tempImage.value = message.image
    }
  })
}

const takePhoto = () => {
  image.value = tempImage.value
  emitValue()
  socket?.emit('message', {
    type: 'lock',
    room: code.value,
  })
}

const clearPhoto = () => {
  image.value = ''
  socket?.emit('message', {
    type: 'unlock',
    room: code.value,
  })
}

const emitValue = () => {
  emit('update:modelValue', image.value)
}

onBeforeUnmount(() => {
  console.log('unmounted')
  socket?.emit('message', {
    type: 'lock',
    room: code.value,
  })
  socket?.disconnect()
  socket?.close()
})
</script>

<template>
  <div
    class="w-full flex justify-center items-center rounded-lg bg-amber-50 border-2 border-dashed overflow-hidden relative"
    :class="{
      'border-amber-200': wsStatus === 'connected',
      'border-green-200': wsStatus === 'joined',
      'border-red-200': wsStatus === 'error',
      'bg-white': wsStatus === 'joined',
    }"
  >
    <div class="w-full h-full flex flex-col justify-center items-center">
      <span v-if="error">
        {{ error }}
      </span>
      <div
        v-else-if="wsStatus != 'joined'"
        class="text-gray-500 flex items-center"
      >
        Pad desconectado [{{ code }}]
      </div>
      <div
        v-else-if="wsStatus === 'joined' && !(image || tempImage)"
        class="text-gray-500 flex items-center"
      >
        Esperando Firma [{{ code }}]...
      </div>
      <img
        v-show="!error && (image || tempImage)"
        :src="image || tempImage"
        alt=""
      />
    </div>
    <div
      v-if="!error && wsStatus === 'joined'"
      class="flex flex-col justify-center absolute right-0"
    >
      <div
        v-if="!image"
        title="Capturar firma"
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
  <!-- {{ modelValue.length }} -->
</template>
