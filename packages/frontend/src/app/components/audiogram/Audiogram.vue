<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAudiogram, TransportType, MaskType, Ear } from './useAudiogram'

const props = withDefaults(
  defineProps<{
    modelValue: string
    readonly: boolean
  }>(),
  {
    modelValue: '',
    readonly: true,
  }
)

const emit = defineEmits(['update:modelValue'])

const {
  init,
  audiogram,
  setTransport,
  transport,
  setMaskType,
  mask,
  setEar,
  ear,
  importAudiogram,
  exportAudiogram,
} = useAudiogram()

watch(
  () => audiogram,
  () => {
    emit('update:modelValue', exportAudiogram())
  },
  { deep: true }
)

onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) return
  init(canvas)

  if (props.modelValue) {
    importAudiogram(props.modelValue)
  }
})
</script>

<template>
  <div class="min-w-min w-full">
    <div class="border flex">
      <div id="tools">
        <div
          v-if="!props.readonly"
          class="w-full flex flex-col items-center font-semibold select-none"
        >
          <span>Oído</span>
          <div class="flex gap-2 justify-between h-full">
            <span
              class="flex items-center cursor-pointer shadow-md rounded-xl p-2 text-blue-800"
              @click="setEar(Ear.Left)"
              :class="{
                'text-white': ear === Ear.Left,
                'bg-blue-600': ear === Ear.Left,
              }"
              >Izquierdo</span
            >
            <span
              class="flex items-center cursor-pointer shadow-md rounded-xl p-2 text-red-600"
              @click="setEar(Ear.Right)"
              :class="{
                'text-white': ear === Ear.Right,
                'bg-red-600': ear === Ear.Right,
              }"
              >Derecho</span
            >
          </div>
        </div>
        <div
          v-if="!props.readonly"
          class="w-full flex flex-col items-center font-semibold select-none"
        >
          <span>Transporte</span>
          <div class="flex gap-2 justify-stretch h-full">
            <span
              class="flex items-center cursor-pointer shadow-md rounded-xl p-2 text-gray-600"
              @click="setTransport(TransportType.Air)"
              :class="{
                'text-green-800': transport === TransportType.Air,
                'bg-green-100': transport === TransportType.Air,
              }"
              >Aire</span
            >
            <span
              class="flex items-center cursor-pointer shadow-md rounded-xl p-2 text-gray-600"
              @click="setTransport(TransportType.Bone)"
              :class="{
                'text-green-700': transport === TransportType.Bone,
                'bg-green-100': transport === TransportType.Bone,
              }"
              >Hueso</span
            >
          </div>
        </div>
        <hr />
        <div
          v-if="!props.readonly"
          class="w-full flex flex-col items-center font-semibold select-none"
        >
          <div class="flex gap-2 justify-stretch h-full">
            <span
              class="flex items-center cursor-pointer shadow-md rounded-xl p-2 text-gray-600"
              @click="
                mask === MaskType.UnMasked
                  ? setMaskType(MaskType.Masked)
                  : setMaskType(MaskType.UnMasked)
              "
              :class="{
                'text-green-800': mask === MaskType.Masked,
                'bg-green-100': mask === MaskType.Masked,
              }"
              >Enmascarado</span
            >
          </div>
        </div>

        <table class="w-full border">
          <thead class="border">
            <tr>
              <th colspan="2" class="text-center">Promedio tonal</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="text-center">{{ audiogram.tonalAverage.left }}</td>
              <td class="text-center">{{ audiogram.tonalAverage.right }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <canvas v-if="!props.readonly" id="canvas"> </canvas>

      <img :src="audiogram.image" alt="" />
    </div>
  </div>
  {{ audiogram }}
</template>

<style scoped>
#tools {
  min-width: 200px;
  min-height: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
