<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const ModuleListBasic = defineAsyncComponent(
  () => import('@components/ModuleListBasic.vue')
)
import { getList } from '../services'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const moduleName = 'Contrato'
const modulePath = 'contracts'

const columns = [
  {
    key: 'documentNumber',
    title: 'No. Documento',
  },
  {
    key: 'name',
    title: 'Nombre',
  },
  {
    key: 'email',
    title: 'Email',
  },
  {
    key: 'phone',
    title: 'Telefono',
  },
  {
    key: 'status',
    title: 'Estado',
  },
  {
    key: 'updatedAt',
    title: 'Ultima modificación',
  },
]

const data = ref<any>([])

const actions = ref([
  ...(useAuthStore().user?.role.permissions.includes('contracts:full')
    ? ['create', 'edit', 'delete']
    : ['view']),
])

const goToCreate = () => {
  console.log('Create')
  router.push({ name: `${modulePath}.create` })
}
const goToEdit = (id: string) => {
  console.log('Edit', id)
  router.push({ name: `${modulePath}.edit`, params: { id } })
}

onMounted(async () => {
  data.value = await getList()
  console.log('Mounted', data.value)
})
</script>

<template>
  <ModuleListBasic
    :title="`${moduleName}s`"
    :subtitle="`Gestión de ${moduleName}s`"
    :columns="columns"
    :rows="data"
    :actions="actions"
    @edit="goToEdit"
    @view="goToEdit"
    @create="goToCreate"
  >
  </ModuleListBasic>
</template>
