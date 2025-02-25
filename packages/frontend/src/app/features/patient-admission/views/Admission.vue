<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useNotificationsStore } from '@/store/notifications'
import { useImageFile } from '@/app/core/composable/useImageFile'
import {
  getOrder,
  admitPatientOrder,
  InformedConsent,
  getInformedConsentsForOrder,
} from '../services'
import OrderStatus from '../../service-orders/components/OrderStatus.vue'
import DynamicFormWithOutTabs from '@features/dynamic-form/component/DynamicFormWithOutTabs.vue'
import { DAlertText, DModal, DToggleField } from '@components/basic'

import DCameraInput from '@components/DCameraInput.vue'
import DSignatureInput from '@components/biometric/DSignatureInput.vue'
import DFingerPrintInput from '@components/biometric/DFingerPrintInput.vue'

const route = useRoute()
const router = useRouter()
const notifications = useNotificationsStore()

const order = ref<any>({})
const loading = ref(false)
const modalIsOpen = ref(false)

const back = () => {
  console.log('Back')
  router.back()
}
let model = ref<any>({})
const dynamicForm = ref<typeof DynamicFormWithOutTabs | null>(null)

const photo = useImageFile('patientPhoto.png')
const signature = useImageFile('patientSignature.png')
const fingerprint = useImageFile('patientFingerprint.png')

const informedConsents = ref<InformedConsent[]>([])

onMounted(async () => {
  if (route.params.id) {
    loading.value = true
    order.value = await getOrder(route.params.id.toString())
    informedConsents.value = await getInformedConsentsForOrder(order.value.id)
    model.value = {
      ...order.value.patient,
      applyPosition: order.value.position,
    }
    photo.loadImageFromId(order.value.patient?.photoId)
    signature.loadImageFromId(order.value.patient?.signatureId)
    fingerprint.loadImageFromId(order.value.patient?.fingerprintId)

    loading.value = false
  }
})

const form: any = {
  groups: [
    {
      name: 'Información basica',
      description: '',
      fields: [
        {
          name: 'documentType',
          label: 'Tipo de Documento',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            disabled: true,
          },
          query: {
            entity: 'general:identification-types',
            fields: ['id', 'name'],
          },
        },
        {
          name: 'documentNumber',
          label: 'No. Documento',
          type: 'text',
          props: {
            placeholder: 'No. Documento',
            class: 'sm:col-span-1  lg:col-span-1 xl:col-span-1',
            disabled: true,
          },
        },
        {
          name: 'name',
          label: 'Primer Nombre',
          type: 'text',
          props: {
            placeholder: '',
            required: true,
          },
          rules: ['required', 'upper', 'minlength:3', 'maxlength:50'],
        },
        {
          name: 'secondName',
          label: 'Segundo Nombre',
          type: 'text',

          rules: ['upper', 'minlength:0', 'maxlength:50'],
        },
        {
          name: 'lastName',
          label: 'Primer Apellido',
          type: 'text',
          props: {
            placeholder: '',
            required: true,
          },
          rules: ['required', 'upper', 'minlength:3', 'maxlength:50'],
        },
        {
          name: 'secondLastName',
          label: 'Segundo Apellido',
          type: 'text',
          rules: ['upper', 'minlength:0', 'maxlength:50'],
        },
        {
          name: 'birthDate',
          label: 'Fecha de nacimiento',
          type: 'date',
          props: {
            placeholder: 'DD/MM/AAAA',
            required: true,
          },
          rules: ['required'],
        },
        {
          name: 'maritalStatus',
          label: 'Estado civil',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            options: [
              { id: 'Casado', name: 'Casado' },
              { id: 'Divorciado', name: 'Divorciado' },
              { id: 'Soltero', name: 'Soltero' },
              { id: 'Union Libre', name: 'Union Libre' },
              { id: 'Viudo', name: 'Viudo' },
            ],
          },
          rules: ['required'],
        },
        {
          name: 'bloodType',
          label: 'Tipo de sangre',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            options: [
              { id: 'A+', name: 'A+' },
              { id: 'A-', name: 'A-' },
              { id: 'B+', name: 'B+' },
              { id: 'B-', name: 'B-' },
              { id: 'AB+', name: 'AB+' },
              { id: 'AB-', name: 'AB-' },
              { id: 'O+', name: 'O+' },
              { id: 'O-', name: 'O-' },
            ],
          },
          rules: ['required'],
        },
        {
          name: 'dominantHand',
          label: 'Dominancia',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            options: [
              { id: 'Diestro', name: 'Diestro' },
              { id: 'Zurdo', name: 'Zurdo' },
              { id: 'Ambidiestro', name: 'Ambidiestro' },
            ],
          },
          rules: ['required'],
        },
        {
          name: 'eps',
          label: 'EPS',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            valueKey: 'concat',
            showKey: 'concat',
          },
          query: {
            entity: 'general:entities',
            fields: ['code', 'name'],
            where: {
              type: 'EPS',
            },
            modifier: {
              concat: ['code', ' - ', 'name'],
            },
          },
          rules: ['required'],
        },
        {
          name: 'epsAffiliationType',
          label: 'Tipo de Vinculación',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            options: [
              { id: 'CONTRIBUTIVO-COTIZANTE', name: 'CONTRIBUTIVO-COTIZANTE' },
              { id: 'CONTRIBUTIVO-BENEFICIARIO', name: 'CONTRIBUTIVO-BENEFICIARIO' },
              { id: 'SUBSIDIADO', name: 'SUBSIDIADO' },
              { id: 'ESPECIAL', name: 'ESPECIAL' },
              { id: 'NO REFIERE', name: 'NO REFIERE' },
            ],
          },
          rules: ['required'],
        },
        {
          name: 'arl',
          label: 'ARL',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            valueKey: 'concat',
            showKey: 'concat',
          },
          query: {
            entity: 'general:entities',
            fields: ['id', 'name'],
            where: {
              type: 'ARL',
            },
            modifier: {
              concat: ['code', ' - ', 'name'],
            },
          },
          rules: ['required'],
        },
        {
          name: 'schoolLevel',
          label: 'Nivel de escolaridad',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            options: [
              { id: 'Sin Escolaridad', name: 'Sin Escolaridad' },
              { id: 'Preescolar', name: 'Preescolar' },
              { id: 'Primaria Incompleta', name: 'Primaria Incompleta' },
              { id: 'Primaria Completa', name: 'Primaria Completa' },
              { id: 'Secundaria Incompleta', name: 'Secundaria Incompleta' },
              { id: 'Secundaria Completa', name: 'Secundaria Completa' },

              { id: 'Técnica', name: 'Técnica' },
              { id: 'Tecnólogica', name: 'Tecnólogica' },
              { id: 'Profesional', name: 'Profesional' },
              { id: 'Especialización', name: 'Especialización' },
              { id: 'Maestría', name: 'Maestría' },
              { id: 'Doctorado', name: 'Doctorado' },
              { id: 'Post-Doctorado', name: 'Post-Doctorado' },
              { id: 'No Refiere', name: 'No Refiere' },
            ],
          },

          rules: ['required'],
        },

        {
          name: 'biologicalSex',
          label: 'Sexo biológico',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            options: [
              { id: 'Femenino', name: 'Femenino' },
              { id: 'Masculino', name: 'Masculino' },
            ],
          },
          rules: ['required'],
        },
        {
          name: 'gender',
          label: 'Género',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            options: [
              { id: 'Femenino', name: 'Femenino' },
              { id: 'Masculino', name: 'Masculino' },
              { id: 'LGBTI', name: 'LGBTI' },
            ],
          },
          rules: ['required'],
        },
        {
          name: 'applyPosition',
          label: 'Cargo al que aplica',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
            disabled: true,
          },
          query: {
            entity: 'general:contract-positions',
            fields: ['id', 'name'],
            where: {
              // contractId: "",
            },
          },
          rules: ['required'],
        },
      ],
    },

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
      name: 'Acompañante:',
      description: '',
      fields: [
        {
          name: 'accompanyingName',
          label: 'Nombre',
          type: 'text',
        },
        {
          name: 'accompanyingParent',
          label: 'Parentesco',
          type: 'text',
        },

        {
          name: 'accompanyingAddress',
          label: 'Lugar de residencia',
          type: 'text',
        },
        {
          name: 'accompanyingPhone',
          label: 'Teléfono ',
          type: 'number',
        },
      ],
    },
    {
      name: 'Responsable:',
      description: '',
      fields: [
        {
          name: 'responsibleName',
          label: 'Nombre',
          type: 'text',
        },
        {
          name: 'responsibleParent',
          label: 'Parentesco',
          type: 'text',
        },

        {
          name: 'responsibleAddress',
          label: 'Lugar de residencia',
          type: 'text',
        },
        {
          name: 'responsiblePhone',
          label: 'Teléfono ',
          type: 'number',
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
      ],
    },
  ],
}

const onSubmit = async () => {
  if (
    informedConsents.value.filter((consent) => !consent.accepted).length > 0
  ) {
    notifications.addNotification({
      title: 'Error',
      text: 'Debe aceptar todos los consentimientos!',
      type: 'error',
    })
    return
  }

  const data = dynamicForm.value?.getAllModel()

  console.log('Submit', data)
  loading.value = true

  const result = await admitPatientOrder(
    route.params.id.toString(),
    {
      ...data,
      ...{
        photoId: await photo.saveImage(),
        signatureId: await signature.saveImage(),
        fingerprintId: await fingerprint.saveImage(),
      },
    },
    informedConsents.value
  )
  loading.value = false

  if (!result.success) {
    notifications.addNotification({
      title: 'Error',
      text: result.errorMessage,
      type: 'error',
    })
    return
  }

  router.push({
    name: 'patient-attention.attention',
    params: { id: route.params.id },
  })
}
</script>

<template>
  <div class="w-full h-full px-5">
    <div class="bg-gray-50">
      <div class="flex justify-between flex-wrap">
        <p
          class="flex items-center gap-5 font-semibold text-shadow text-blue-900"
        >
          Orden # {{ order.code }}
          <span class="font-semibold"
            >{{ order.medicalExamType?.name }} :
            {{ order.medicalExamType?.emphasis }}
          </span>
          <OrderStatus :status="order.status" />
        </p>
        <DAlertText v-if="order.observation">
          {{ order.observation }}
        </DAlertText>
      </div>
    </div>

    <div
      class="w-full h-full mt-5 bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3"
    >
      <div
        class="flex flex-col justify-end"
        style="height: calc(100vh - 120px)"
      >
        <div class="w-full flex flex-row h-full">
          <div class="w-96 p-2 bg-slate-100 flex flex-col gap-2">
            <DCameraInput
              :model-value="photo.imageBase64.value"
              @update:model-value="photo.setImage"
            />
            <DSignatureInput
              :model-value="signature.imageBase64.value"
              @update:model-value="signature.setImage"
            />
            {{ signature.unsaved }}
            <DFingerPrintInput
              :model-value="fingerprint.imageBase64.value"
              @update:model-value="fingerprint.setImage"
            />
            {{ fingerprint.unsaved }}
          </div>
          <div class="w-full overflow-y-scroll">
            <DynamicFormWithOutTabs
              v-if="!loading"
              ref="dynamicForm"
              :form-schema="form"
              :initial-model="model"
              title-btn-save="Ingresar paciente"
              gridClass="grid grid-cols-6 px-6 pb-5 w-full"
              @cancel="back"
              @submit="modalIsOpen = true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <DModal
    :open="modalIsOpen"
    title="¿El paciente acepta los siguientes consentimientos?"
    nameButtonClose="Cancelar"
    accept-question="Continuar"
    typeAlert="question"
    :form="true"
    @closeModal="modalIsOpen = false"
    @other-method="onSubmit"
  >
    <template #form>
      <div class="w-full flex flex-col gap-10 p-20">
        <div class="flex justify-center">
          <h3 class="text-lg font-semibold">
            El paciente acepta los siguientes consentimientos?
          </h3>
        </div>
        <div v-for="consent in informedConsents" class="flex justify-between">
          <span class="font-normal">{{ consent.name }}</span>
          <DToggleField v-model="consent.accepted" />
        </div>
      </div>
    </template>
  </DModal>
</template>
