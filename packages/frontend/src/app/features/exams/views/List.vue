<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModuleListBasic from '../../../components/ModuleListBasic.vue'
import { getList } from '../services'

const router = useRouter()
const moduleName = 'Examen'
const modulePath = 'exams'

const columns = [
  {
    key: 'type',
    title: 'Tipo',
    align: 'left',
  },
  {
    key: 'code',
    title: 'Codigo',
    align: 'left',
  },
  {
    key: 'name',
    title: 'Nombre',
    align: 'left',
  },
  {
    key: 'version',
    title: 'Version',
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
  router.push({ name: `${modulePath}.create` })
}
const goToEdit = (id: string) => {
  console.log('Edit', id)
  router.push({ name: `${modulePath}.edit`, params: { id } })
}
const goToPreview = (id: string) => {
  router.push({ name: `${modulePath}.preview`, params: { id } })
}

onMounted(async () => {
  data.value = await getList()
  console.log('Mounted', data.value)
})
</script>

<template>
  <ModuleListBasic
    :title="`${moduleName}es`"
    :subtitle="`Gestión de ${moduleName}es`"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create', 'preview']"
    @edit="goToEdit"
    @create="goToCreate"
    @preview="goToPreview"
  >
  </ModuleListBasic>
</template>
