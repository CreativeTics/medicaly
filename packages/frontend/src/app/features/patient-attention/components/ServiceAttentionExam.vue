<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import {
  getAnnotation,
  getPatient,
  cacheAnnotation,
  getLastExam,
} from '../services/services'
import DynamicFormWithOutTabs from '@features/dynamic-form/component/DynamicFormWithOutTabs.vue'

const props = defineProps<{
  orderId: string
  patientDataId: string
  examCode: any
}>()
const annotation = ref<any>({})
const exam = ref<any>({})
const patientData = ref<any>({})
const model = ref<any>({})

const form: any = {
  groups: [
    {
      name: 'Datos Demograficos',
      description: '',
      fields: [
        {
          name: 'precedenceCity',
          label: 'Ciudad de procedencia',
          type: 'select',
          props: {
            required: true,
            showKey: 'concat',
          },
          query: {
            entity: 'general:cities',
            fields: ['id', 'name', 'departmentName'],
            modifier: {
              concat: ['name', '(', 'departmentName', ')'],
            },
          },
          rules: ['required'],
        },
        {
          name: 'residenceCity',
          label: 'Ciudad de residencia',
          type: 'select',
          props: {
            required: true,
            showKey: 'concat',
          },
          query: {
            entity: 'general:cities',
            fields: ['id', 'name', 'departmentName'],
            modifier: {
              concat: ['name', '(', 'departmentName', ')'],
            },
          },
          rules: ['required'],
        },
        {
          name: 'residenceType',
          label: 'Tipo',
          type: 'select',
          props: {
            required: true,
            options: [
              { id: 'Rural', name: 'Rural' },
              { id: 'Urbano', name: 'Urbano' },
            ],
          },

          rules: ['required'],
        },
        {
          name: 'residenceAddress',
          label: 'Dirección de residencia',
          type: 'text',
          props: {
            class: 'lg:col-span-4 xl:col-span-4',
            placeholder: '',
            required: true,
          },
          rules: ['required', 'minlength:3', 'maxlength:100'],
        },
        {
          name: 'residencePhone',
          label: 'Teléfono de residencia',
          type: 'number',
          props: {
            required: true,
          },
          rules: ['required', 'integer', 'minlength:7', 'maxlength:10'],
        },
      ],
    },

    {
      name: '',
      description: '',
      fields: [
        {
          name: 'observation',
          label: 'Observaciones',
          type: 'textarea',
          props: {
            class: 'sm:col-span-6 lg:col-span-6 xl:col-span-6',
          },
        },
        {
          name: '',
          label: '',
          type: 'div',
          defaultValue: false,
          props: {
            class: 'sm:col-span-4 lg:col-span-4 xl:col-span-4',
          },
        },
        {
          name: 'informedConsent',
          label: 'El Paciente acepta el consentimiento informado?',
          type: 'check',
          defaultValue: false,
          rules: ['required-check'],
        },
      ],
    },
  ],
}

const dynamicForm = ref<typeof DynamicFormWithOutTabs | null>(null)

const saveInCache = () => {
  console.log('saveInCache')
  const data = toRaw(dynamicForm.value?.getAllModel())
  console.log('data', data)
  cacheAnnotation(props.orderId, exam.id, data)
}

onMounted(async () => {
  annotation.value = await getAnnotation(props.orderId, props.examCode)

  exam.value = await getLastExam(props.examCode, annotation)

  patientData.value = await getPatient(props.patientDataId)

  model.value = {
    ...patientData,
    ...annotation,
  }
})
</script>
<template>
  <div class="w-full mb-5">
    <span class="text-md text-gray-500 w-full flex justify-center">
      {{ exam.name }} v.{{ exam.version }}
    </span>

    <DynamicFormWithOutTabs
      ref="dynamicForm"
      :form-schema="form"
      :initial-model="model"
      title-btn-save="Guardar examen"
      gridClass="grid grid-cols-6 px-6 pb-5 w-full"
      @update-field="saveInCache"
    />
  </div>
</template>
