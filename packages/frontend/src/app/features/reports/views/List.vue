<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
const ModuleListBasic = defineAsyncComponent(
  () => import('@components/ModuleListBasic.vue')
)

const router = useRouter()

const columns = [
  {
    key: 'id',
    title: 'Código',
    align: 'left',
  },
  {
    key: 'name',
    title: 'Reporte',
    align: 'left',
  },
]

const data = ref<any>([
  {
    id: '2',
    name: 'Ordenes de servicio',
  },
  {
    id: '3',
    name: 'Ordenes Atendidas por Medico/Auxiliar',
  },
])

const goToView = (id: number) => {
  router.push({ name: `reports.basics.view`, params: { id } })
}
</script>

<template>
  <ModuleListBasic
    title="Reportes básicos"
    subtitle="Visualiza los reportes básicos"
    :columns="columns"
    :rows="data"
    :actions="['view']"
    @view="goToView"
  >
  </ModuleListBasic>
</template>
