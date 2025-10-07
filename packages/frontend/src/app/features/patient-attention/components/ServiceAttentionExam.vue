<script setup lang="ts">
import { computed, onBeforeMount, ref, toRaw } from 'vue'
import {
  getAnnotation,
  getPatient,
  cacheAnnotation,
  getLastExamOrAnnotationExam,
  saveAnnotation,
} from '../services/services'
import DynamicFormWithOutTabs from '@features/dynamic-form/component/DynamicFormWithOutTabs.vue'
import { DBtn } from '@components/basic'
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loading01Icon,
  Save02Icon,
} from '@components/basic/icons'
import { useNotificationsStore } from '@/store/notifications'
import { useAttentionStore } from '@/store/patient-attention'

const props = defineProps<{
  orderId: string
  serviceId: string
  patientDataId: string
  examId: string
  examCode: string
}>()

const notifications = useNotificationsStore()
const { setAnnotation } = useAttentionStore()

const isHidden = ref(true)
const isLoading = ref(false)
const isSaving = ref(false)
const exam = ref<any>({})
const model = ref<any>({})

const dynamicForm = ref<typeof DynamicFormWithOutTabs | null>(null)

const titleSaveButton = computed(() => {
  return model.value.id ? 'Actualizar examen' : 'Guardar examen'
})

const saveInCache = () => {
  const data = toRaw(dynamicForm.value?.getAllModel())
  cacheAnnotation(props.orderId, props.serviceId, props.examCode, data)
}

const getExamAndAnnotation = async () => {
  const patientData = await getPatient(props.patientDataId)
  const annotation = await getAnnotation(
    props.orderId,
    props.serviceId,
    props.examCode
  )
  exam.value = await getLastExamOrAnnotationExam(props.examId, annotation)

  model.value = {
    patient: {
      age: patientData.age,
      biologicalSex: patientData.biologicalSex,
      birthDate: patientData.birthDate,
      position: patientData.position,
    },
    ...(annotation ?? {}),
  }
}

onBeforeMount(async () => {
  isLoading.value = true
  await getExamAndAnnotation()
  isLoading.value = false
})

const submit = async (data: any) => {
  if (isSaving.value) return

  isSaving.value = true
  console.log('submit', data)
  delete data.patient
  const id = await saveAnnotation(
    props.orderId,
    props.serviceId,
    exam.value.id,
    props.examCode,
    exam.value.version,
    data
  )
  if (!id) {
    notifications.addNotification({
      title: 'Error',
      text: 'Error al guardar el examen',
    })
    isSaving.value = false
    return
  }

  dynamicForm.value?.setModelValue('id', id)
  model.value.id = id
  setAnnotation(exam.value.id, id)

  notifications.addNotification({
    title: 'Ok',
    text: 'Examen guardado con correctamente!',
  })
  isSaving.value = false
}
</script>
<template>
  <div v-if="!isLoading" class="w-full mb-5">
    <span
      class="text-sm text-gray-500 w-full flex items-center hover:bg-slate-50 cursor-pointer"
      @click="isHidden = !isHidden"
    >
      <div class="flex-grow flex">
        {{ exam.name?.toUpperCase() }} v.{{ exam.version }}
        <div v-if="isSaving">Guardando examen...</div>
        <div v-else>
          <span v-if="model.id" class="text-green-500"> (Guardado) </span>
          <span v-else class="text-amber-500"> (Pendiente) </span>
        </div>
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

    <div v-else class="relative">
      <div
        v-if="isSaving"
        class="absolute z-50 w-full h-full bg-black opacity-50"
      >
        <div
          class="w-full h-full flex items-center justify-center text-white opacity-100"
        >
          Guardando examen... <Loading01Icon class="h-5 w-5 animate-spin" />
        </div>
      </div>
      <DynamicFormWithOutTabs
        v-show="!isHidden"
        ref="dynamicForm"
        :form-schema="exam.form"
        :initial-model="model"
        :hide-cancel-button="true"
        gridClass="grid grid-cols-6 px-6 pb-5 w-full"
        @update-field="saveInCache"
        @submit="submit"
      >
        <template v-slot:save-btn="{ onHandleSubmit }">
          <DBtn
            v-if="!model.id"
            class="font-semibold py-1 text-base gap-2"
            @click.prevent="onHandleSubmit"
          >
            {{ titleSaveButton }}
          </DBtn>
          <DBtn
            v-else
            class="font-semibold py-1 text-base gap-2 bg"
            color="success"
            @click.prevent="onHandleSubmit"
          >
            <Save02Icon class="h-6 w-6" />
            {{ titleSaveButton }}
          </DBtn>
        </template>
      </DynamicFormWithOutTabs>
    </div>
  </div>
  <div v-else class="flex">
    Cargando examen {{ examCode }}
    <Loading01Icon class="h-5 w-5 animate-spin" />
  </div>
</template>
