<script lang="ts" setup>
import { Edit03Icon, Trash03Icon, DBtn } from '../../../components/basic'
import PaginatedTable from '../../../components/PaginatedTable.vue'
import DSideModal from '../../../components/DSideModal.vue'
import Popper from 'vue3-popper'
import {
  getList,
  create,
  edit,
  getEntity,
  deleteEntity,
} from '../services/services'
import { Form, DynamicForm } from '../../dynamic-form'
import { onMounted, ref } from 'vue'
import { useNotificationsStore } from '@/store/notifications'

const moduleName = 'Servicio'
// const modulePath = "contract-subsidiaries";

const notifications = useNotificationsStore()
const props = defineProps<{
  id: string
}>()

const modalIsOpen = ref(false)
const model = ref<any>({})
const table = ref<HTMLElement | null>(null)

const form: Form = {
  entity: '',
  tabs: [
    {
      name: 'Servicios del contrato',
      groups: [
        {
          name: '',
          description: '',
          fields: [
            {
              name: 'code',
              label: 'Codigo',
              type: 'text',
              props: {
                placeholder: 'Codigo del Servicio',
                class: 'lg:col-span-6 xl:col-span-6',
                required: true,
              },
              rules: ['required', 'integer', 'minlength:3', 'maxlength:50'],
            },
            {
              name: 'name',
              label: 'Nombre',
              type: 'text',
              props: {
                placeholder: 'Nombre del Servicio',
                class: 'lg:col-span-6 xl:col-span-6',
                required: true,
              },
              rules: ['required', 'minlength:3', 'maxlength:50'],
            },
            {
              name: 'amount',
              label: 'Precio',
              type: 'text',
              props: {
                placeholder: 'Precio del Servicio $',
                class: 'lg:col-span-6 xl:col-span-6',
                required: true,
              },
              rules: ['required', 'integer', 'min:1000', 'max:100000000'],
            },
          ],
        },
        {
          name: ' Examenes',
          description:
            'Defina aqui los examenes que se deberan diligenciar para este servicio.',
          fields: [
            {
              name: 'examType',
              label: 'Tipo de Examen',
              type: 'select',
              props: {
                required: true,
                class: 'lg:col-span-6 xl:col-span-6',
                showKey: 'concat',
              },
              rules: ['required'],
              query: {
                entity: 'general:contract-medical-exam-types',
                fields: ['id', 'name', 'emphasis'],
                where: {
                  contractId: props.id,
                },
                modifier: {
                  concat: ['name', ':', 'emphasis'],
                },
              },
            },
            {
              name: 'exams',
              label: 'Examenes Asignados',
              type: 'multiselect',
              props: {
                required: true,
                class: 'lg:col-span-6 xl:col-span-6',
              },
              rules: ['required-array'],
              query: {
                entity: 'medical:exams',
                fields: ['id', 'code', 'name', 'version'],
              },
            },
          ],
        },
      ],
    },
  ],
}

const columns = [
  {
    key: 'examType',
    title: 'Tipo de examen',
  },
  {
    key: 'code',
    title: 'Codigo',
  },
  {
    key: 'name',
    title: 'Nombre',
  },

  {
    key: 'amount',
    title: 'precio',
  },
  {
    key: 'exams',
    title: 'Examenes',
  },
  {
    key: 'actions',
    title: '',
  },
]
const rows = ref<any[]>([])

const loadRows = async () => {
  rows.value = await getList(props.id)
  // @ts-ignore
  table.value?.updateRows(rows.value)
}
// await loadRows();

// Create new

const handleAdd = () => {
  model.value = {}
  modalIsOpen.value = true
}

const handleEdit = async (id: string) => {
  model.value = await getEntity(id)
  modalIsOpen.value = true
}

const cancel = () => {
  modalIsOpen.value = false
}

const handleDelete = async (id: string) => {
  console.log(id)
  if (await deleteEntity(id)) {
    notifications.addNotification({
      type: 'success',
      title: `${moduleName} creado`,
      text: `La ${moduleName} se ha eliminado correctamente`,
    })
  } else {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: `No se ha podido eliminar la ${moduleName}`,
    })
  }
  await loadRows()
}

const onSubmit = async (data: any) => {
  console.log('Submit', data)
  data.contractId = props.id

  if (data.id === undefined) {
    console.log('Create')
    if (await create(data)) {
      notifications.addNotification({
        type: 'success',
        title: `${moduleName} creado`,
        text: `La ${moduleName} se ha creado correctamente`,
      })
    } else {
      notifications.addNotification({
        type: 'error',
        title: 'Error',
        text: `No se ha podido crear la ${moduleName}`,
      })
    }
  } else {
    if (await edit(data.id as string, data)) {
      notifications.addNotification({
        type: 'success',
        title: `${moduleName} actualizado`,
        text: `La ${moduleName} se ha actualizado correctamente`,
      })
    } else {
      notifications.addNotification({
        type: 'error',
        title: 'Error',
        text: `No se ha podido actualizar la ${moduleName}`,
      })
    }
  }
  await loadRows()
  modalIsOpen.value = false
}

onMounted(async () => {
  await loadRows()
})
</script>
<template>
  <div class="bg-gray-50 pb-4">
    <div class="sm:flex justify-between pt-2">
      <PaginatedTable
        ref="table"
        :columns="columns"
        :rows="rows"
        style="max-height: 400px"
      >
        <template #newAction>
          <DBtn class="mr-10" color="success" @click="handleAdd">Agregar</DBtn>
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

            <div class="flex justify-end gap-1" v-else>
              <Popper
                arrow
                offsetDistance="12"
                content="Editar"
                :hover="true"
                placement="top"
                class="tooltip"
              >
                <div
                  class="bg-gray-50 rounded-md py-2"
                  @click="handleEdit(rowProps.row.id)"
                >
                  <Edit03Icon
                    class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                  />
                </div>
              </Popper>
              <Popper
                arrow
                offsetDistance="12"
                content="Eliminar"
                :hover="true"
                placement="top"
                class="tooltip"
              >
                <div
                  class="bg-gray-50 rounded-md py-2"
                  @click="handleDelete(rowProps.row.id)"
                >
                  <Trash03Icon
                    class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                  />
                </div>
              </Popper>
            </div>
          </td>
        </template>
      </PaginatedTable>
    </div>
    <DSideModal
      v-if="modalIsOpen"
      class="flex flex-col p-10"
      @closeBackdrop="cancel"
    >
      <DynamicForm
        v-if="form?.tabs"
        :form-schema="form"
        :initial-model="model"
        title-btn-save="Guardar"
        :fixed-height="false"
        grid-class="grid-cols-1 p-5"
        @cancel="cancel"
        @submit="onSubmit"
      />
    </DSideModal>
  </div>
</template>
