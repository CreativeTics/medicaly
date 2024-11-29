<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const ModuleListBasic = defineAsyncComponent(
  () => import('@components/ModuleListBasic.vue')
)
import { getRoles } from '../services'

const router = useRouter()

const columns = [
  {
    key: 'name',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'description',
    title: 'Descripción',
    align: 'left',
  },
  {
    key: 'permissions',
    title: 'Permisos',
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
  router.push({ name: 'roles.create' })
}
const goToEdit = (id: string) => {
  console.log('Edit', id)
  router.push({ name: 'roles.edit', params: { id } })
}

onMounted(async () => {
  data.value = await getRoles()
  console.log('Mounted', data.value)
})
</script>

<template>
  <ModuleListBasic
    title="Roles"
    subtitle="Gestión de Roles"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create']"
    @edit="goToEdit"
    @create="goToCreate"
  >
  </ModuleListBasic>
</template>
