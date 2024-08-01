<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, DynamicForm } from '../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'

import { ContractSelectResult, create, getContracts } from '../services'

const notifications = useNotificationsStore()
const moduleName = 'ordenes de servicio'
const modulePath = 'service-orders'

const route = useRoute()
const router = useRouter()

let model = {}
const loading = ref(false)

const contracts = ref<ContractSelectResult[]>([])
const form = ref<Form>()

onMounted(async () => {
  loading.value = true
  contracts.value.push(...(await getContracts()))
  await loadForm()
  loading.value = false
})

const loadForm = async () => {
  form.value = {
    entity: modulePath,
    tabs: [
      {
        name: 'Datos',
        groups: [
          {
            name: 'Información básica',
            description: '',
            fields: [
              {
                name: 'contract',
                label: 'Contrato',
                type: 'select',
                props: {
                  required: true,
                  class: 'lg:col-span-6 xl:col-span-6',
                  options: contracts.value,
                },
                rules: ['required'],
                editingProps: {
                  disabled: true,
                },
              },
              {
                name: 'medicalExamType',
                label: 'Tipo de examen',
                type: 'select',
                props: {
                  required: true,
                  showKey: 'concat',
                },
                rules: ['required'],
                editingProps: {
                  disabled: true,
                },
                query: {
                  entity: 'general:contract-medical-exam-types',
                  fields: ['id', 'name', 'emphasis'],
                  where: {},
                  modifier: {
                    concat: ['name', ':', 'emphasis'],
                  },
                },
                dependsOn: {
                  field: 'contract',
                  filterTag: 'contractId',
                },
              },
              {
                name: 'contractSubsidiary',
                label: 'Sede',
                type: 'select',
                props: {
                  required: true,
                },
                rules: ['required'],
                editingProps: {
                  disabled: true,
                },
                query: {
                  entity: 'user-contract-subsidiaries',
                  fields: ['id', 'name'],
                  where: {},
                },
                dependsOn: {
                  field: 'contract',
                  filterTag: 'contractId',
                },
              },
              {
                name: 'contractCostCenter',
                label: 'Centro de costo',
                type: 'select',
                props: {
                  required: true,
                },
                rules: ['required'],
                editingProps: {
                  disabled: true,
                },
                query: {
                  entity: 'general:contract-cost-centers',
                  fields: ['id', 'name'],
                },
                dependsOn: {
                  field: 'contract',
                  filterTag: 'contractId',
                },
              },
              {
                name: 'subsidiary',
                label: 'Sede de atención',
                type: 'select',
                props: {
                  required: true,
                },
                rules: ['required'],
                editingProps: {
                  disabled: true,
                },
                query: {
                  entity: 'general:subsidiaries',
                  fields: ['id', 'name'],
                },
              },
            ],
          },
          {
            name: 'Servicios a prestar',
            description: '',
            fields: [
              {
                name: 'services',
                label: 'ServiceList',
                if: 'medicalExamType',
                type: 'ServiceOrdersList',
                props: {
                  required: true,
                  class: 'lg:col-span-6 xl:col-span-6',
                },
                rules: ['required-array'],
              },
            ],
          },
          {
            name: 'Pacientes',
            description: '',
            fields: [
              {
                name: 'patients',
                label: 'ServiceOrderPatients',
                if: 'contract',
                type: 'ServiceOrderPatients',
                props: {
                  required: true,
                  class: 'lg:col-span-6 xl:col-span-6',
                },
                rules: ['required-array'],
              },
            ],
          },
        ],
      },
    ],
  }
  console.log('Form Loaded', form)
}

const onSubmit = async (data: any) => {
  console.log('Submit', data)

  const { isOk, errors } = await create(toRaw(data))

  if (isOk) {
    notifications.addNotification({
      type: 'success',
      title: `${moduleName} creado`,
      text: `El ${moduleName} se ha creado correctamente`,
    })
    router.push({ name: `${modulePath}.list` })
  } else {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: `${(errors ?? []).join(', ') ?? ''}`,
    })
  }
}

const back = () => {
  console.log('Back')
  router.push({ name: `${modulePath}.list` })
}
</script>

<template>
  <div class="h-full px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow text-blue-900">
          {{ route.params.id == undefined ? 'Crear' : 'Editar' }}
          {{ moduleName }}
        </p>
      </div>
    </div>
    <DynamicForm
      v-if="form && !loading"
      :form-schema="form"
      :initial-model="model"
      :title-btn-save="route.params.id === undefined ? 'Guardar' : 'Actualizar'"
      @cancel="back"
      @submit="onSubmit"
    />
  </div>
</template>
