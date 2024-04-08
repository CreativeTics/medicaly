<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModuleListBasic from '../../../../components/ModuleListBasic.vue'
import { getUsers } from '../services'

const router = useRouter()

const columns = [
  {
    key: 'type',
    title: 'Tipo',
    align: 'left',
  },
  {
    key: 'name',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'username',
    title: 'Usuario',
    align: 'left',
  },
  {
    key: 'roleName',
    title: 'Rol',
    align: 'left',
  },
  {
    key: 'updatedAt',
    title: 'Ultima modificación',
    align: 'left',
  },
]

const data = ref<any>([])

const goToCreate = () => {
  console.log('Create')
  router.push({ name: 'users.create' })
}
const goToEdit = (id: string) => {
  console.log('Edit', id)
  router.push({ name: 'users.edit', params: { id } })
}

onMounted(async () => {
  data.value = await getUsers()
  console.log('Mounted', data.value)
})
</script>

<template>
  <ModuleListBasic
    title="Usuarios"
    subtitle="Gestión de usuarios del sistema"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create']"
    @edit="goToEdit"
    @create="goToCreate"
  >
  </ModuleListBasic>
</template>
