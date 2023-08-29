<script setup lang="ts">
import { getService } from '../services/services'
import DynamicFormWithOutTabs from '@features/dynamic-form/component/DynamicFormWithOutTabs.vue'

const props = defineProps<{
  orderId: string
  serviceId: string
}>()

const service = await getService(props.serviceId)
const annotation = {}

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
          name: 'eps',
          label: 'EPS',
          type: 'select',
          props: {
            class: 'lg:col-span-1 xl:col-span-1',
            required: true,
          },
          query: {
            entity: 'general:entities',
            fields: ['id', 'name'],
            where: {
              type: 'EPS',
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
              { id: 'CONTRIBUTIVO', name: 'CONTRIBUTIVO' },
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
          },
          query: {
            entity: 'general:entities',
            fields: ['id', 'name'],
            where: {
              type: 'ARL',
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
</script>
<template>
  <div class="w-full h-full">
    {{ service.name }}
    {{ annotation }}
    <div v-for="exam in service.exams" class="w-full">
      {{ exam.name }}
      {{ exam.form }}
      <DynamicFormWithOutTabs
        :form-schema="form"
        :initial-model="annotation"
        title-btn-save="Ingresar paciente"
        gridClass="grid grid-cols-6 px-6 pb-5 w-full"
      />
    </div>
  </div>
</template>
