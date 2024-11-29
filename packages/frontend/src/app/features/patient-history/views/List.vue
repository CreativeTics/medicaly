<script setup lang="ts">
import { ref, onMounted, reactive, defineAsyncComponent } from 'vue'
import { DBtn, DTextField, DSelectFieldSearch } from '@/app/components/basic'
import { SearchMdIcon } from '@components/basic/icons'

const PaginatedTable = defineAsyncComponent(
  () => import('@/app/components/PaginatedTable.vue')
)
import Popper from 'vue3-popper'
import { useRouter } from 'vue-router'
import {
  searchPatients,
  getDocumentTypes,
  DocumentType,
  PatientSearchResult,
} from '../services'

const router = useRouter()

const actionsColumn = {
  key: 'actions',
  title: '',
}

const columns = [
  {
    key: 'documentType',
    title: 'Tipo de documento',
    align: 'left',
  },
  {
    key: 'documentNumber',
    title: 'Numero de documento',
    align: 'left',
  },
  {
    key: 'fullName',
    title: 'Nombre del paciente',
    align: 'left',
  },
  {
    key: 'createdAt',
    title: 'Fecha de creación',
    align: 'left',
  },
]

const documentTypes = ref<DocumentType[]>([])
const searchOptions = reactive({
  patientDocumentType: '',
  patientDocumentNumber: '',
})
const data = ref<PatientSearchResult[]>([])

const search = async () => {
  data.value = []
  data.value = await searchPatients(searchOptions)
}

const goToHistory = (patientId: string) => {
  router.push(`/patient-history/${patientId}`)
}

onMounted(async () => {
  documentTypes.value = await getDocumentTypes()
})
</script>

<template>
  <div class="h-full px-5 overflow-auto scroll">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">
          Historia - buscar paciente
        </p>
        <p class="text-gray-500 text-shadow"></p>
      </div>
      <div class="sm:flex justify-between pt-2">
        <PaginatedTable
          :columns="[...columns, actionsColumn]"
          :rows="data"
          style="height: calc(100vh - 200px)"
        >
          <template #header>
            <div class="py-3 w-full flex flex-row gap-5 items-end">
              <DSelectFieldSearch
                label="Tipo de Documento:"
                v-model="searchOptions.patientDocumentType"
                :options="documentTypes"
                @search="search"
                class="min-w-fit w-96"
              />
              <DTextField
                label="Numero de documento"
                placeholder="Digite el documento del paciente"
                class="min-w-fit w-1/3"
                v-model="searchOptions.patientDocumentNumber"
                @keyup.enter="search"
              />
              <DBtn class="h-10 w-20" @click.prevent="search">Buscar</DBtn>
            </div>
          </template>

          <template #row="rowProps">
            <td
              v-for="column in rowProps.columns"
              v-bind:key="column.key"
              class="px-3"
            >
              <div
                class="w-full"
                v-if="column.key !== 'actions' && column.key !== 'documentType'"
              >
                {{ rowProps.row[column.key] }}
              </div>

              <div
                class="max-w-xs gap-2"
                v-else-if="column.key === 'documentType'"
              >
                {{
                  documentTypes.find(
                    (dt) => dt.id === rowProps.row.documentType
                  )?.name
                }}
              </div>

              <div class="max-w-xs flex justify-end gap-2" v-else>
                <Popper
                  arrow
                  offsetDistance="12"
                  content="Ver Historia"
                  :hover="true"
                  placement="left"
                  class="tooltip"
                >
                  <div
                    class="bg-gray-50 rounded-md py-2"
                    @click="goToHistory(rowProps.row.id)"
                  >
                    <SearchMdIcon
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
