<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getService, getExamsForUser } from '../services/services'

import Exam from './ServiceAttentionExam.vue'
const availableExams = ref<any[]>([])

const props = defineProps<{
  orderId: string
  patientDataId: string
  serviceId: string
  exams: string[]
}>()
const service = ref<any>({})

onMounted(async () => {
  service.value = await getService(props.serviceId, props.exams)
  availableExams.value = await getExamsForUser()
})
</script>
<template>
  <div class="w-full">
    <span class="text-xl text-indigo-800 font-semibold flex justify-between">
      <!-- {{ service.name }} -->
    </span>
    <div v-for="exam in service.exams">
      <Exam
        v-if="availableExams.includes(exam.code)"
        :order-id="orderId"
        :service-id="serviceId"
        :patient-data-id="patientDataId"
        :exam-id="exam.id"
        :exam-code="exam.code"
        class="w-full mb-5"
      />
    </div>
  </div>
</template>
