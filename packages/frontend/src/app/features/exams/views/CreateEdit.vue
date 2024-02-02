<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, DynamicForm } from '../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'

import { create, getEntity, edit } from '../services'

const notifications = useNotificationsStore()
const moduleName = 'Exam'
const modulePath = 'exams'

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
              name: 'type',
              label: 'Tipo',
              type: 'select',
              props: {
                required: true,
                'value-key': 'code',
              },
              editingProps: {
                disabled: true,
              },
              rules: ['required'],
              query: {
                entity: 'medical:exam-types',
                fields: ['code', 'name'],
              },
            },
            {
              name: 'code',
              label: 'Codigo',
              type: 'text',
              props: {
                placeholder: 'Codigo',
                required: true,
              },
              editingProps: {
                disabled: true,
              },
              rules: ['required', 'upper', 'minlength:1', 'maxlength:50'],
            },
            {
              name: 'version',
              label: 'Version',
              type: 'text',
              props: {
                disabled: 'true',
                placeholder: 'Se crea automaticamente',
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
              name: 'printTemplate',
              label: 'Plantilla de impresión',
              type: 'select',

              query: {
                entity: 'general:templates',
                fields: ['id', 'code', 'name'],
              },
            },
            {
              name: 'form',
              label: 'Formulario',
              type: 'textarea',
              props: {
                rows: 10,
                placeholder: 'texto de la recomendación',
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
    if (await edit(data)) {
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
