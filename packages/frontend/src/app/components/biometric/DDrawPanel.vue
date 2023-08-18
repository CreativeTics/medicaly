<script setup lang="ts">
import SignaturePad from 'signature_pad'
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const signaturePad = ref<SignaturePad | null>(null)

const resizeCanvas = () => {
  const data: any = signaturePad.value?.toData()
  const ratio = Math.max(window.devicePixelRatio || 1, 1)

  if (!canvas.value) {
    return
  }
  canvas.value.width = canvas.value?.offsetWidth * ratio
  canvas.value.height = canvas.value?.offsetHeight * ratio
  canvas.value?.getContext('2d')?.scale(ratio, ratio)

  signaturePad.value?.clear()
  //   this.signatureData = TRANSPARENT_PNG;
  signaturePad.value?.fromData(data)
}

const clear = () => {
  signaturePad.value?.clear()
}

const save = () => {
  return signaturePad.value?.toDataURL()
}

const isEmpty = () => {
  return signaturePad.value?.isEmpty()
}

defineExpose({
  clear,
  save,
  isEmpty,
})

onMounted(() => {
  signaturePad.value = new SignaturePad(canvas.value!, {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    penColor: 'rgb(0, 0, 0)',
  })
  resizeCanvas()
})
</script>
<template>
  <div class="h-full w-full border-2 rounded-lg">
    <canvas ref="canvas" class="h-full w-full"></canvas>
  </div>
</template>
