<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getContractPositionNameById, getPatient } from '../services/services'
import { useImageFile } from '@/app/core/composable/useImageFile'
import { DAlertText } from '@components/basic'

const props = defineProps({
  patientName: String,
  patientDataId: String,
  contractName: String,
  positionId: String,
})

const patient = ref<any>({})
const photo = useImageFile()
const positionName = ref('')

onMounted(async () => {
  if (props.patientDataId) {
    patient.value = await getPatient(props.patientDataId)
    photo.loadImageFromId(patient.value.photoId)
    if (props.positionId)
      positionName.value = await getContractPositionNameById(props.positionId)
  }
})
</script>

<template>
  <div class="flex items-start justify-end flex-wrap gap-2">
    <DAlertText v-if="patient.observation" class="text-xs w-full">
      {{ patient.observation }}
    </DAlertText>
    <div class="font-semibold text-gray-900 p-3 flex flex-col items-end">
      {{ patientName }}
      <span class="text-sm font-normal text-gray-500">
        {{ contractName }}({{ positionName }})
      </span>
      <span class="text-sm font-normal text-gray-500">
        {{ patient.age?.years }} años, {{ patient.age?.months }} meses,
        {{ patient.age?.days }} dias
      </span>
      <span class="text-sm font-normal text-gray-500">
        {{ patient.gender }}</span
      >
    </div>
    <div
      class="rounded-full h-24 w-24 min-w-min bg-white hidden md:block"
      style="min-width: 6rem"
    >
      <img
        class="rounded-full object-cover h-24 w-24"
        :src="photo.imageBase64.value"
        alt="Foto del paciente"
      />
    </div>
  </div>
</template>
