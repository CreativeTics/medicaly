<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, DynamicForm } from '../../../dynamic-form'
import { useNotificationsStore } from '@/store/notifications'

import { create, getUser, edit } from '../services'

const notifications = useNotificationsStore()

const route = useRoute()
const router = useRouter()

let model = {}
const loading = ref(false)

const form: Form = {
  entity: 'users',
  tabs: [
    {
      name: 'General',
      groups: [
        {
          name: 'General',
          fields: [
            {
              name: 'name',
              label: 'Nombre',
              type: 'text',
              props: {
                rows: 3,
                placeholder: 'Nombre',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
            },
            {
              name: 'type',
              label: 'Tipo de usuario',
              type: 'select',
              props: {
                required: true,
              },
              rules: ['required'],
              query: {
                entity: 'userTypes',
                fields: ['id', 'name'],
              },
            },
            {
              name: 'role',
              label: 'Rol',
              type: 'select',
              props: {
                required: true,
              },
              rules: ['required'],
              query: {
                entity: 'auth:roles',
                fields: ['id', 'name'],
              },
            },
            {
              name: 'username',
              label: 'Usuario',
              type: 'text',
              props: {
                rows: 3,
                placeholder: 'Usuario',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
            },

            {
              name: 'tempPassword',
              label: 'Contraseña temporal',
              type: 'text',
              props: {
                placeholder: '********',
              },
              rules: ['maxlength:50'],
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
    if (await create(data)) {
      notifications.addNotification({
        type: 'success',
        title: 'Usuario creado',
        text: 'El usuario se ha creado correctamente',
      })
      router.push({ name: 'users.list' })
    } else {
      notifications.addNotification({
        type: 'error',
        title: 'Error',
        text: 'No se ha podido crear el usuario',
      })
    }
  } else {
    if (await edit(route.params.id as string, data)) {
      notifications.addNotification({
        type: 'success',
        title: 'Usuario actualizado',
        text: 'El usuario se ha actualizado correctamente',
      })
      router.push({ name: 'users.list' })
    } else {
      notifications.addNotification({
        type: 'error',
        title: 'Error',
        text: 'No se ha podido actualizar el usuario',
      })
    }
  }
}

const back = () => {
  console.log('Back')
  router.push({ name: 'users.list' })
}

onBeforeMount(async () => {
  loading.value = true

  if (route.params.id) {
    model = await getUser(route.params.id as string)
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
          Usuario
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
