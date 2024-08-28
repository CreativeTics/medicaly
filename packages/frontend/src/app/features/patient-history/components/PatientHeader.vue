<script setup lang="ts">
import { onMounted } from 'vue'
import { useImageFile } from '@/app/core/composable/useImageFile'

interface Patient {
  id: string
  name: string
  document: string
  photoId: string
  birthDate: string
  gender: string
}

const props = defineProps<{ patient: Patient }>()

const photo = useImageFile()

onMounted(async () => {
  if (props.patient?.photoId) {
    photo.loadImageFromId(props.patient.photoId)
  }
})
</script>

<template>
  <div class="flex">
    <div class="rounded-full h-24 w-24 bg-white">
      <img
        class="rounded-full object-cover h-full w-full"
        :src="photo.imageBase64.value"
        alt="Foto del paciente"
      />
    </div>
    <div class="text-lg font-semibold text-gray-900 p-3 flex flex-col">
      {{ patient.name }}
      <span class="text-sm text-gray-500">
        {{ patient.document }}
      </span>
      <span class="text-sm font-normal text-gray-500">
        {{ patient.birthDate }}
      </span>
      <span class="text-sm font-normal text-gray-500">
        {{ patient.gender }}</span
      >
    </div>
  </div>
</template>
