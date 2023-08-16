<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import DDrawPanel from './DDrawPanel.vue'
import { DBtn, Trash03Icon } from '../basic'

const props = defineProps<{
  code: string
}>()

const drawPanel = ref<typeof DDrawPanel | null>(null)
const wsStatus = ref('disconnected')
const enabled = ref(false)
let socket: Socket | null = null

const connect = () => {
  socket = io('ws://localhost:3001/signature-pad')
  socket.on('connect', () => {
    console.log('Pad connected')
    wsStatus.value = 'connected'
    socket.emit('join', props.code)
  })
  socket.on('disconnect', () => {
    console.log('disconnected')
    wsStatus.value = 'disconnected'
  })
  socket.on('joined', (room) => {
    console.log(`joined to  ${room}`)
    wsStatus.value = 'joined'
    autoSave()
  })
}

onMounted(() => {
  connect()
})
onUnmounted(() => {
  console.log('unmounted')
  socket?.disconnect()
  socket?.close()
})

const autoSave = () => {
  setInterval(() => {
    if (wsStatus.value === 'joined' && enabled.value) {
      save()
    }
  }, 500)
}

const save = () => {
  const { data } = drawPanel.value.save()
  socket.emit('message', {
    type: 'signature-update',
    image: data,
    room: props.code,
  })
}
</script>
<template>
  <div class="fixed h-full w-full bg-black opacity-30 z-50"></div>
  <div
    class="h-screen w-screen p-5 flex flex-col justify-center items-center relative"
  >
    <div class="absolute bottom-1/3 w-full px-10 z-0">
      <hr />
    </div>
    <div class="absolute top-5 right-5">
      {{ wsStatus }}
      <DBtn @click="drawPanel.clear()">
        <Trash03Icon />
      </DBtn>
    </div>
    <DDrawPanel ref="drawPanel" />
    <div>
      <span class="ml-2 text-lg text-gray-500">Firme dentro del recuadro!</span>
    </div>
  </div>
</template>
