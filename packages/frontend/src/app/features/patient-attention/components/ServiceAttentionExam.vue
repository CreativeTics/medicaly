<script setup lang="ts">
import { onBeforeMount, ref, toRaw } from 'vue'
import {
  getAnnotation,
  getPatient,
  cacheAnnotation,
  getLastExamOrAnnotationExam,
} from '../services/services'
import DynamicFormWithOutTabs from '@features/dynamic-form/component/DynamicFormWithOutTabs.vue'
import { AlertCircleIcon } from '@components/basic'

const props = defineProps<{
  orderId: string
  patientDataId: string
  examCode: any
}>()
const annotation = ref<any>({})
const exam = ref<any>({})
const patientData = ref<any>({})
const model = ref<any>({})

const dynamicForm = ref<typeof DynamicFormWithOutTabs | null>(null)

const saveInCache = () => {
  console.log('saveInCache')
  const data = toRaw(dynamicForm.value?.getAllModel())
  console.log('data', data)
  cacheAnnotation(props.orderId, props.examCode, data)
}

onBeforeMount(async () => {
  annotation.value = await getAnnotation(props.orderId, props.examCode)

  patientData.value = await getPatient(props.patientDataId)
  exam.value = await getLastExamOrAnnotationExam(props.examCode, annotation)

  model.value = {
    patient: patientData.value,
    ...(annotation.value ?? {}),
  }
})
</script>
<template>
  <div class="w-full mb-5">
    <span class="text-md text-gray-500 w-full flex justify-center">
      {{ exam.name }} v.{{ exam.version }}
    </span>

    <div
      v-if="!exam.formIsValid"
      class="w-full h-5 flex items-center justify-center text-red-700 bg-red-100 rounded-md p-5"
    >
      <AlertCircleIcon class="w-5 h-5 mr-2" />
      El formulario no es valido, contacte con el administrador!
    </div>

    <DynamicFormWithOutTabs
      v-else
      ref="dynamicForm"
      :form-schema="exam.form"
      :initial-model="model"
      title-btn-save="Guardar examen"
      gridClass="grid grid-cols-6 px-6 pb-5 w-full"
      @update-field="saveInCache"
    />
  </div>
</template>
