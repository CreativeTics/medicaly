<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModuleListBasic from '../../../components/ModuleListBasic.vue'
import { getList } from '../services'

const router = useRouter()

const columns = [
  {
    key: 'documentNumber',
    title: 'No. Documento',
    align: 'left',
  },
  {
    key: 'fullName',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'position',
    title: 'Cargo',
  },
  {
    key: 'user',
    title: 'Usuario',
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
  router.push({ name: 'employees.create' })
}
const goToEdit = (id: string) => {
  console.log('Edit', id)
  router.push({ name: 'employees.edit', params: { id } })
}

onMounted(async () => {
  data.value = await getList()
  console.log('Mounted', data.value)
})
</script>

<template>
  <ModuleListBasic
    title="Empleados"
    subtitle="Gestión de Empleados"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create']"
    @edit="goToEdit"
    @create="goToCreate"
  >
  </ModuleListBasic>
</template>
