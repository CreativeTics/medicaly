<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Form, DynamicForm } from '../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'

import {
  getEntity,
  edit,
  getPreviewPrintTemplateUrl,
} from '../services/templates'
import Popper from 'vue3-popper'
import { PrinterIcon } from '@components/basic/icons'

const notifications = useNotificationsStore()
const moduleName = 'Templates'

const route = useRoute()

let model = {} as any
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
            {
              name: 'props',
              label: 'Propiedades de Impresión',
              type: 'textarea',
              props: {
                rows: 5,
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

const generatePreview = async (code: string) => {
  console.log('Generate preview')
  const url = await getPreviewPrintTemplateUrl(
    code,
    'b79264275ddd22421f37df9854018a75'
  )
  window.open(url, '_blank')
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
      <div class="leading-4 pt-responsive flex justify-between">
        <p class="text-3xl font-semibold text-shadow text-blue-900">
          Editar Templates
        </p>

        <span>
          <Popper
            arrow
            offsetDistance="12"
            content="Previsualizar"
            :hover="true"
            placement="left"
            class="tooltip"
          >
            <div
              class="bg-white rounded-md py-2"
              @click="generatePreview(model.code)"
            >
              <PrinterIcon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
            </div>
          </Popper>
        </span>
      </div>
    </div>
    <DynamicForm
      v-if="form?.tabs && !loading"
      :form-schema="form"
      :initial-model="model"
      title-btn-save="Actualizar"
      @cancel=""
      @submit="onSubmit"
    />
  </div>
</template>
