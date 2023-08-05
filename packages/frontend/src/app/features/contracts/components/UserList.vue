<script lang="ts" setup>
import { Edit03Icon, Trash03Icon, DBtn } from "../../../components/basic";
import PaginatedTable from "../../../components/PaginatedTable.vue";
import DSideModal from "../../../components/DSideModal.vue";
import Popper from "vue3-popper";
import {
  getList,
  create,
  edit,
  getEntity,
  deleteEntity,
} from "../services/users";
import { Form, DynamicForm } from "../../dynamic-form";
import { onMounted, ref } from "vue";
import { useNotificationsStore } from "@/store/notifications";

const moduleName = "Usuario";
// const modulePath = "contract-subsidiaries";

const notifications = useNotificationsStore();
const props = defineProps<{
  id: string;
}>();

const modalIsOpen = ref(false);
const model = ref<any>({});
const table = ref<HTMLElement | null>(null);

const form: Form = {
  entity: "",
  tabs: [
    {
      name: "Usuarios del contrato",
      groups: [
        {
          name: "",
          description: "",
          fields: [
            {
              name: "name",
              label: "Nombre",
              type: "text",
              props: {
                placeholder: "Nombre del Servicio",
                class: "lg:col-span-6 xl:col-span-6",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:50"],
            },
            {
              name: "username",
              label: "Username",
              type: "text",
              props: {
                placeholder: "",
                class: "lg:col-span-6 xl:col-span-6",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:50"],
            },
            {
              name: "tempPassword",
              label: "Contraseña temporal",
              type: "text",
              props: {
                placeholder: "********",
                class: "lg:col-span-6 xl:col-span-6",
                required: true,
              },
              rules: ["required", "minlength:6", "maxlength:50"],
            },
            {
              name: "role",
              label: "Rol",
              type: "select",
              props: {
                required: true,
                class: "lg:col-span-6 xl:col-span-6",
              },
              rules: ["required"],
              query: {
                entity: "auth:roles",
                fields: ["id", "name"],
              },
            },
            {
              name: "subsidiaries",
              label: "Sedes Asignadas",
              type: "multiselect",
              props: {
                required: true,
                class: "lg:col-span-6 xl:col-span-6",
              },
              rules: ["required-array"],
              query: {
                entity: "general:contract-subsidiaries",
                fields: ["id", "code", "name", "version"],
                where: {
                  contractId: props.id,
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

const columns = [
  {
    key: "name",
    title: "Nombre",
  },
  {
    key: "username",
    title: "Nombre de usuario",
  },
  {
    key: "tempPassword",
    title: "Contraseña temporal",
  },

  {
    key: "role",
    title: "Rol Asignado",
  },
  {
    key: "subsidiaries",
    title: "Sedes habilitadas",
  },

  {
    key: "actions",
    title: "",
  },
];
const rows = ref<any[]>([]);

const loadRows = async () => {
  rows.value = await getList(props.id);
  // @ts-ignore
  table.value?.updateRows(rows.value);
};
// await loadRows();

// Create new

const handleAdd = () => {
  model.value = {};
  modalIsOpen.value = true;
};

const handleEdit = async (id: string) => {
  model.value = await getEntity(id);
  modalIsOpen.value = true;
};

const cancel = () => {
  modalIsOpen.value = false;
};

const handleDelete = async (id: string) => {
  console.log(id);
  if (await deleteEntity(id)) {
    notifications.addNotification({
      type: "success",
      title: `${moduleName} creado`,
      text: `El ${moduleName} se ha eliminado correctamente`,
    });
  } else {
    notifications.addNotification({
      type: "error",
      title: "Error",
      text: `No se ha podido eliminar el ${moduleName}`,
    });
  }
  await loadRows();
};

const onSubmit = async (data: any) => {
  console.log("Submit", data);
  data.contractId = props.id;

  if (data.id === undefined) {
    console.log("Create");
    if (await create(props.id, data)) {
      notifications.addNotification({
        type: "success",
        title: `${moduleName} creado`,
        text: `el ${moduleName} se ha creado correctamente`,
      });
    } else {
      notifications.addNotification({
        type: "error",
        title: "Error",
        text: `No se ha podido crear el ${moduleName}`,
      });
    }
  } else {
    if (await edit(props.id, data.id as string, data)) {
      notifications.addNotification({
        type: "success",
        title: `${moduleName} actualizado`,
        text: `La ${moduleName} se ha actualizado correctamente`,
      });
    } else {
      notifications.addNotification({
        type: "error",
        title: "Error",
        text: `No se ha podido actualizar el ${moduleName}`,
      });
    }
  }
  await loadRows();
  modalIsOpen.value = false;
};

onMounted(async () => {
  await loadRows();
});
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
            class="px-3"
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
