<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, DynamicForm } from '../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'
import { create, getEntity, edit } from '../services'

const notifications = useNotificationsStore()
const moduleName = 'Contrato'
const modulePath = 'contracts'

const route = useRoute()
const router = useRouter()

let model = {}
const loading = ref(false)

const form: Form = {
  entity: modulePath,
  tabs: [
    {
      name: 'Datos',
      groups: [
        {
          name: 'Información basica',
          description: 'Esta es la información basica del contrato.',
          fields: [
            {
              name: 'status',
              label: 'Estado',
              type: 'select',
              props: {
                required: true,
                class: 'lg:col-span-1 xl:col-span-1',
                options: [
                  { id: 'active', name: 'Activo' },
                  { id: 'inactive', name: 'Inactivo' },
                ],
              },
              default: 'active',
              rules: ['required'],
            },
            {
              name: 'documentType',
              label: 'Tipo de Documento',
              type: 'select',
              props: {
                class: 'lg:col-span-1 xl:col-span-1',
                required: true,
              },
              query: {
                entity: 'general:identification-types',
                fields: ['id', 'name'],
                sort: [{ name: 'asc' }],
              },
              rules: ['required'],
            },
            {
              name: 'documentNumber',
              label: 'No. Documento',
              type: 'text',
              props: {
                placeholder: 'No. Documento',
                class: 'lg:col-span-1 xl:col-span-1',
                required: true,
              },
              rules: ['required', 'integer', 'minlength:3', 'maxlength:50'],
            },
            {
              name: 'name',
              label: 'Nombre',
              type: 'text',
              props: {
                placeholder: 'Nombre',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
            },
            // {
            //   name: "billingCode",
            //   label: "Codigo de facturación",
            //   type: "text",
            //   props: {
            //     placeholder: "Codigo de facturación",
            //     required: true,
            //   },
            //   rules: ["required", "upper", "minlength:3", "maxlength:50"],
            // },
            {
              name: 'legalRepresentative',
              label: 'Representante legal',
              type: 'text',
              props: {
                placeholder: 'Representante legal',
                required: true,
              },
              rules: [
                'required',
                'alphanumeric',
                'minlength:3',
                'maxlength:50',
              ],
            },
            {
              name: 'email',
              label: 'Email',
              type: 'text',
              props: {
                placeholder: 'email@example.com',
                required: true,
              },
              rules: ['required', 'email'],
            },
            {
              name: 'phone',
              label: 'Teléfono',
              type: 'text',
              props: {
                placeholder: 'Teléfono',
                required: true,
              },
              rules: ['required', 'integer', 'minlength:6', 'maxlength:20'],
            },
            {
              name: 'department',
              label: 'Departamento',
              type: 'select',
              props: {
                required: true,
              },
              rules: ['required'],
              query: {
                entity: 'general:departments',
                fields: ['id', 'name'],
                where: {
                  countryName: 'Colombia',
                },
                sort: [{ name: 'asc' }],
              },
            },
            {
              name: 'city',
              label: 'Ciudad',
              type: 'select',
              props: {
                required: true,
              },
              rules: ['required'],
              query: {
                entity: 'general:cities',
                fields: ['id', 'name'],
                sort: [{ name: 'asc' }],
              },
              dependsOn: {
                field: 'department',
              },
            },
            {
              name: 'address',
              label: 'Dirección',
              type: 'text',
              props: {
                placeholder: 'Dirección',
                class: 'lg:col-span-4 xl:col-span-4',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:100'],
            },
            {
              name: 'observations',
              label: 'Observaciones',
              type: 'textarea',
              props: {
                rows: 3,
                placeholder: 'Observaciones',
                class: 'lg:col-span-6 xl:col-span-6',
              },
              rules: ['maxlength:500'],
            },
          ],
        },
      ],
    },
    {
      name: 'Sedes',
      groups: [
        {
          name: 'Sedes',
          description: 'Registre aqui la lista de sedes  del contrato.',
          fields: [
            {
              name: '',
              label: 'Observaciones',
              type: 'ContractSubsidiaryList',
              props: {
                id: route.params.id,
                class: 'lg:col-span-6 xl:col-span-6',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Centros de Costo',
      groups: [
        {
          name: 'Centros de costo',
          description:
            'Registre aqui la lista de centros de costo del contrato.',
          fields: [
            {
              name: '',
              label: '',
              type: 'ContractCostCenterList',
              props: {
                id: route.params.id,
                class: 'lg:col-span-6 xl:col-span-6',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Profesiograma',
      groups: [
        {
          name: 'Cargos',
          description:
            'Registre aqui la lista de cargos habilitados del contrato.',
          fields: [
            {
              name: '',
              label: '',
              type: 'ContractPositionsList',
              props: {
                id: route.params.id,
                class: 'lg:col-span-6 xl:col-span-6',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Tipos de examen',
      groups: [
        {
          name: 'Tipos de Examen',
          description:
            'Registre aqui la lista de tipos de examen  habilitados del contrato.',
          fields: [
            {
              name: '',
              label: '',
              type: 'ContractMedicalExamTypes',
              props: {
                id: route.params.id,
                class: 'lg:col-span-6 xl:col-span-6',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Servicios',
      groups: [
        {
          name: 'Servicios',
          description:
            'Registre aqui la lista de Servicios habilitados del contrato.',
          fields: [
            {
              name: '',
              label: '',
              type: 'ContractServicesList',
              props: {
                id: route.params.id,
                class: 'lg:col-span-6 xl:col-span-6',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Usuarios',
      groups: [
        {
          name: 'Usuarios',
          description:
            'Registre aqui la lista de usuarios habilitados del contrato.',
          fields: [
            {
              name: '',
              label: '',
              type: 'ContractUserList',
              props: {
                id: route.params.id,
                class: 'lg:col-span-6 xl:col-span-6',
              },
            },
          ],
        },
      ],
    },
  ],
}

const onSubmit = async (data: any) => {
  console.log('Submit', data)

  if (route.params.id === undefined) {
    console.log('Create')
    if (await create(data)) {
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
        text: `No se ha podido crear el ${moduleName}`,
      })
    }
  } else {
    if (await edit(route.params.id as string, data)) {
      notifications.addNotification({
        type: 'success',
        title: `${moduleName} actualizado`,
        text: `El ${moduleName} se ha actualizado correctamente`,
      })
      router.push({ name: `${modulePath}.list` })
    } else {
      notifications.addNotification({
        type: 'error',
        title: 'Error',
        text: `No se ha podido actualizar el ${moduleName}`,
      })
    }
  }
}

const back = () => {
  console.log('Back')
  router.push({ name: `${modulePath}.list` })
}

onBeforeMount(async () => {
  loading.value = true

  console.log('Mounted', route.params.id)
  if (route.params.id) {
    model = await getEntity(route.params.id as string)
    console.log('Model', model)
  }
  loading.value = false
})
</script>

<template>
  <div class="h-full overflow-x-scroll px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow text-blue-900">
          {{ route.params.id == undefined ? 'Crear' : 'Editar' }}
          {{ moduleName }}
        </p>
      </div>
    </div>
    <div class="form overflow-auto">
      <DynamicForm
        v-if="form?.tabs && !loading"
        :form-schema="form"
        :initial-model="model"
        :title-btn-save="
          route.params.id === undefined ? 'Guardar' : 'Actualizar'
        "
        @cancel="back"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>
<style scoped></style>
