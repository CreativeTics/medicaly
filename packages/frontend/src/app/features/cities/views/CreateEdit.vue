<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, DynamicForm } from '../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'

import { create, getEntity, edit } from '../services'

const notifications = useNotificationsStore()
const moduleName = 'Ciudad'
const modulePath = 'cities'

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
          description: '',
          fields: [
            {
              name: 'country',
              label: 'País',
              type: 'select',
              props: {
                required: true,
              },
              editingProps: {
                disabled: true,
              },
              rules: ['required'],
              query: {
                entity: 'general:countries',
                fields: ['id', 'name'],
                sort: [{ name: 'asc' }],
              },
            },
            {
              name: 'department',
              label: 'Departamento',
              type: 'select',
              props: {
                required: true,
              },
              editingProps: {
                disabled: true,
              },
              rules: ['required'],
              query: {
                entity: 'general:departments',
                fields: ['id', 'name'],
                sort: [{ name: 'asc' }],
              },
              dependsOn: {
                field: 'country',
              },
            },
            {
              name: 'code',
              label: 'Código de la Ciudad',
              type: 'text',
              props: {
                placeholder: 'Código de la Ciudad',
                required: true,
              },
              rules: ['required', 'upper', 'minlength:2', 'maxlength:50'],
            },
            {
              name: 'name',
              label: 'Nombre de la Ciudad',
              type: 'text',
              props: {
                placeholder: 'Nombre del Pais',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
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
