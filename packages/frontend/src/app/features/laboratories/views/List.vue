<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const ModuleListBasic = defineAsyncComponent(
  () => import('@components/ModuleListBasic.vue')
)
import { getList } from '../services'

const router = useRouter()
const moduleName = 'Laboratorio'
const modulePath = 'laboratories'

const columns = [
  {
    key: 'name',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'exams',
    title: 'Examenes habilitados',
    align: 'left',
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
    :actions="['edit', 'delete', 'create']"
    @edit="goToEdit"
    @create="goToCreate"
  >
  </ModuleListBasic>
</template>
