<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  useAudiogram,
  TransportType,
  MaskType,
  Ear,
  SerializedAudiogram,
} from './useAudiogram'

const props = withDefaults(
  defineProps<{
    modelValue: SerializedAudiogram
    label?: string
    hint?: string
    disabled?: boolean
    hidden?: boolean
    error?: string
    required?: boolean
  }>(),
  {
    label: 'Audiograma',
    hint: '',
    disabled: false,
    hidden: false,
    error: '',
    required: false,
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
    if (JSON.stringify(audiogram) !== JSON.stringify(props.modelValue)) {
      emit('update:modelValue', exportAudiogram())
    }
  },
  { deep: true }
)

const loaded = ref(false)
watch(
  () => props.modelValue,
  (newVal) => {
    if (!loaded.value && newVal) {
      importAudiogram(newVal)
      loaded.value = true
    }
  },
  { deep: true }
)

onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) return
  init(canvas)
})
</script>

<template>
  <div class="min-w-min w-full flex flex-col">
    <span class="block text-sm font-medium text-gray-800 mb-1.5" v-if="label">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </span>
    <div class="border flex">
      <div id="tools">
        <div
          v-if="!props.disabled"
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
          v-if="!props.disabled"
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
          v-if="!props.disabled"
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
              <th colspan="2" class="text-center">
                Promedio tonal <br /><span class="text-xs text-gray-500"
                  >(500, 1k, 2k, 4k)</span
                >
              </th>
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
      <canvas v-if="!props.disabled" id="canvas"> </canvas>
      <img v-else :src="audiogram.image" alt="" />
    </div>
    <span v-if="hint" class="text-xs text-gray-500">{{ hint }}</span>
    <span v-if="error" class="text-xs text-red-500">{{ error }} </span>
  </div>
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
