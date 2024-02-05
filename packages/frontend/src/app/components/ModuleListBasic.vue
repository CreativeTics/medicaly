<script lang="ts" setup>
import { ref } from 'vue'

import {
  DLoading,
  Edit03Icon,
  DBtn,
  FileSearch01Icon,
} from '@/app/components/basic'
import PaginatedTable from './PaginatedTable.vue'
import Popper from 'vue3-popper'

withDefaults(
  defineProps<{
    title: string
    subtitle: string
    columns: any[]
    rows: any[]
    actions: string[]
  }>(),
  {
    title: () => 'Title',
    subtitle: () => 'Subtitle',
    columns: () => [],
    rows: () => [],
    actions: () => [],
  }
)

const emit = defineEmits(['edit', 'create', 'delete', 'preview'])

const emitEdit = (id: string) => {
  emit('edit', id)
}

const emitCreate = () => {
  emit('create')
}

const actionsColumn = {
  key: 'actions',
  title: '',
}

const loading = ref(false)
</script>
<template>
  <DLoading v-show="loading" message="Cargando datos..." />

  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">{{ title }}</p>
        <p class="text-gray-500 text-shadow">
          {{ subtitle }}
        </p>
      </div>
      <div class="sm:flex justify-between pt-2">
        <PaginatedTable
          :columns="[...columns, actionsColumn]"
          :rows="rows"
          style="height: calc(100vh - 200px)"
        >
          <template #newAction>
            <DBtn v-if="actions.includes('create')" @click.prevent="emitCreate"
              >Crear Nuevo</DBtn
            >
          </template>
          <template #row="rowProps">
            <td
              v-for="column in rowProps.columns"
              v-bind:key="column.key"
              class="px-3 bg-white"
              :class="column.key === 'actions' ? 'sticky right-0' : ''"
            >
              <div
                class="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
                v-if="column.key !== 'actions'"
              >
                {{ rowProps.row[column.key] }}
              </div>

              <div class="max-w-xs flex justify-end gap-2" v-else>
                <Popper
                  v-if="actions.includes('preview')"
                  arrow
                  offsetDistance="12"
                  content="Preview"
                  :hover="true"
                  placement="top"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="emit('preview', rowProps.row['id'])"
                  >
                    <FileSearch01Icon
                      class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                    />
                  </div>
                </Popper>
                <Popper
                  v-if="actions.includes('edit')"
                  arrow
                  offsetDistance="12"
                  content="Editar"
                  :hover="true"
                  placement="top"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="emitEdit(rowProps.row['id'])"
                  >
                    <Edit03Icon
                      class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                    />
                  </div>
                </Popper>
              </div>
            </td>
          </template>
        </PaginatedTable>
      </div>
    </div>
  </div>
</template>
