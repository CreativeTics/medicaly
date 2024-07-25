<script setup lang="ts">
import { onBeforeMount, ref, toRaw } from 'vue'
import {
  getAnnotation,
  getPatient,
  cacheAnnotation,
  getLastExamOrAnnotationExam,
  saveAnnotation,
} from '../services/services'
import DynamicFormWithOutTabs from '@features/dynamic-form/component/DynamicFormWithOutTabs.vue'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from '@components/basic'
import { useNotificationsStore } from '@/store/notifications'

const props = defineProps<{
  orderId: string
  serviceId: string
  patientDataId: string
  examCode: any
}>()

const notifications = useNotificationsStore()

const isHidden = ref(true)
const exam = ref<any>({})
const model = ref<any>({})

const dynamicForm = ref<typeof DynamicFormWithOutTabs | null>(null)

const saveInCache = () => {
  console.log('saveInCache')
  const data = toRaw(dynamicForm.value?.getAllModel())
  console.log('data', data)
  cacheAnnotation(props.orderId, props.serviceId, props.examCode, data)
}

const getExamAndAnnotation = async () => {
  const patientData = await getPatient(props.patientDataId)
  const annotation = await getAnnotation(props.orderId, props.examCode)
  console.log('annotation', annotation)
  exam.value = await getLastExamOrAnnotationExam(props.examCode, annotation)

  model.value = {
    patient: patientData,
    ...(annotation ?? {}),
  }
}

onBeforeMount(async () => {
  await getExamAndAnnotation()
})

const submit = async (data: any) => {
  console.log('submit', data)
  delete data.patient
  await saveAnnotation(
    props.orderId,
    props.serviceId,
    exam.value.id,
    props.examCode,
    exam.value.version,
    data
  )

  await getExamAndAnnotation()

  notifications.addNotification({
    title: 'Ok',
    text: 'Examen guardado con correctamente!',
  })
}
</script>
<template>
  <div class="w-full mb-5">
    <span
      class="text-md text-gray-500 w-full flex justify-center items-center hover:bg-slate-50 cursor-pointer"
    >
      <div class="flex-grow flex justify-center" @click="isHidden = !isHidden">
        {{ exam.name }} v.{{ exam.version }}
        <span v-if="model.id" class="text-green-500"> (Guardado) </span>
        <span v-else class="text-amber-500"> (Pendiente) </span>
        <!-- TODO: if model has medical concept, show -->
        <p v-if="model.id" class="px-10 overflow-ellipsis">
          Concepto medico: {{ model.fullName }}
        </p>
      </div>
      <div class="bg-gray-50 rounded-md py-2" @click="isHidden = !isHidden">
        <EyeIcon
          v-if="isHidden"
          title="Ocultar examen"
          class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
        />
        <EyeOffIcon
          v-else
          title="Mostrar examen"
          class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
        />
      </div>
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
      v-show="!isHidden"
      ref="dynamicForm"
      :form-schema="exam.form"
      :initial-model="model"
      :hide-cancel-button="true"
      title-btn-save="Guardar examen"
      gridClass="grid grid-cols-6 px-6 pb-5 w-full"
      @update-field="saveInCache"
      @submit="submit"
    />
  </div>
</template>
