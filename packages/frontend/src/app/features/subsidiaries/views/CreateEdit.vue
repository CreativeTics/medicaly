<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, DynamicForm } from '../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'

import { create, getEntity, edit } from '../services'

const notifications = useNotificationsStore()
const moduleName = 'Sede de atención'
const modulePath = 'subsidiaries'

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
          name: 'Información básica',
          description: '',
          fields: [
            {
              name: 'code',
              label: 'Código de la sede',
              type: 'text',
              props: {
                placeholder: 'Código de la sede',
                required: true,
              },
              rules: ['required', 'upper', 'minlength:3', 'maxlength:50'],
            },

            {
              name: 'name',
              label: 'Nombre de la sede',
              type: 'text',
              props: {
                placeholder: 'Nombre de la sede',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
            },
            {
              name: 'fiscalId',
              label: 'Identificación fiscal(Nit)',
              type: 'text',
              props: {
                placeholder: 'Nit de la sede',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
            },
          ],
        },
        {
          name: 'Información de Habilitación',
          description: '',
          fields: [
            {
              name: 'serviceDeliveryCode',
              label: 'Código de prestación de servicios',
              type: 'text',
              props: {
                placeholder: '',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
            },
            {
              name: 'serviceModality',
              label: 'Modalidad de prestación de servicios',
              type: 'select',
              props: {
                required: true,
                options: [
                  { id: '01', name: '01 - Intramural' },
                  { id: '04', name: '04 - Extramural jornada de salud' },
                ],
              },
              rules: ['required'],
            },
            {
              name: 'serviceType',
              label: 'Servicio a Prestar',
              type: 'select',
              props: {
                required: true,
                options: [
                  { id: '328', name: '328  - Medicina General' },
                  {
                    id: '407',
                    name: '407 - Medicina del trabajo y medicina Laboral',
                  },
                ],
              },
              rules: ['required'],
            },
          ],
        },
        {
          name: 'Consecutivos',
          description: '',
          fields: [
            {
              name: 'prefix',
              label: 'Prefijo',
              type: 'text',
              props: {
                placeholder: 'Prefijo para las Ordenes',
                required: true,
              },
              rules: ['required', 'upper', 'minlength:2', 'maxlength:50'],
            },
            {
              name: 'lastOrderNumber',
              label: 'Ultimo numero de orden',
              type: 'text',
              props: {
                placeholder: 'Se genera automáticamente',
                disabled: true,
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
      v-if="form?.tabs && !loading"
      :form-schema="form"
      :initial-model="model"
      :title-btn-save="route.params.id === undefined ? 'Guardar' : 'Actualizar'"
      @cancel="back"
      @submit="onSubmit"
    />
  </div>
</template>
