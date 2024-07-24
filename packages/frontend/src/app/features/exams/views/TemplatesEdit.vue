<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, DynamicForm } from '../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'

import { getEntity, edit } from '../services/templates'

const notifications = useNotificationsStore()
const moduleName = 'Templates'

const route = useRoute()

let model = {}
const loading = ref(false)

const form: Form = {
  entity: 'general:templates',
  tabs: [
    {
      name: 'Datos',
      groups: [
        {
          name: 'Información basica',
          description: '',
          fields: [
            {
              name: 'code',
              label: 'Codigo',
              type: 'text',
              props: {
                placeholder: 'Codigo',
              },
              editingProps: {
                disabled: true,
              },
            },
            {
              name: 'name',
              label: 'Nombre',
              type: 'text',
              props: {
                placeholder: 'Nombre',
                required: true,
                class: 'lg:col-span-4 xl:col-span-4',
              },
              rules: ['required', 'minlength:3', 'maxlength:100'],
            },
            {
              name: 'header',
              label: 'Encabezado',
              type: 'textarea',
              props: {
                rows: 5,
                required: true,
                class: 'lg:col-span-6 xl:col-span-6',
              },
              rules: ['required', 'minlength:3'],
            },
            {
              name: 'body',
              label: 'Cuerpo',
              type: 'textarea',
              props: {
                rows: 20,
                required: true,
                class: 'lg:col-span-6 xl:col-span-6',
              },
              rules: ['required', 'minlength:3'],
            },
            {
              name: 'footer',
              label: 'Pie de Pagina',
              type: 'textarea',
              props: {
                rows: 5,
                required: true,
                class: 'lg:col-span-6 xl:col-span-6',
              },
              rules: ['required', 'minlength:3'],
            },
          ],
        },
      ],
    },
  ],
}

const onSubmit = async (data: any) => {
  console.log('Submit', data)

  if (await edit(route.params.id as string, data)) {
    notifications.addNotification({
      type: 'success',
      title: `${moduleName} actualizado`,
      text: `El ${moduleName} se ha actualizado correctamente`,
    })
  } else {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: `No se ha podido actualizar el ${moduleName}`,
    })
  }
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
      @cancel=""
      @submit="onSubmit"
    />
  </div>
</template>
