<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getService } from '../services/services'
import Exam from './ServiceAttentionExam.vue'

const props = defineProps<{
  orderId: string
  patientDataId: string
  serviceId: string
}>()
const service = ref<any>({})

onMounted(async () => {
  service.value = await getService(props.serviceId)
})
</script>
<template>
  <div class="w-full p-5">
    <span class="text-xl text-indigo-800 font-semibold flex justify-between">
      {{ service.name }}
    </span>

    <Exam
      v-for="exam in service.exams"
      :order-id="orderId"
      :service-id="serviceId"
      :patient-data-id="patientDataId"
      :exam-code="exam.code"
      class="w-full mb-5"
    />
  </div>
</template>
