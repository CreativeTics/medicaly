<script setup lang="ts">
import { ref, onMounted } from "vue";
import { DBtn, DLoading } from "@components/basic";
import { Form, DynamicForm } from "../../dynamic-form";
import { useNotificationsStore } from "@/store/notifications";
import { getOrganization, create, edit } from "../services";

const notifications = useNotificationsStore();
const moduleName = "Organización";

const loading = ref(true);
const editing = ref(false);
const organization = ref<any>(null);
let model: any = {};

const form: Form = {
  entity: "organizations",
  tabs: [
    {
      name: "Datos",
      groups: [
        {
          name: "Información de la organización",
          description: "",
          fields: [
            {
              name: "name",
              label: "Razón Social / Nombre",
              type: "text",
              props: {
                placeholder: "Razón social o nombre de la organización",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:150"],
            },
            {
              name: "identification",
              label: "Identificación",
              type: "text",
              props: {
                placeholder: "NIT o número de identificación",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:50"],
            },
            {
              name: "address",
              label: "Dirección Principal",
              type: "textarea",
              class: "sm:col-span-6 lg:col-span-6 xl:col-span-6",
              props: {
                placeholder: "Dirección principal de la organización",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:200"],
            },
          ],
        },
      ],
    },
  ],
};

const loadOrganization = async () => {
  loading.value = true;
  organization.value = await getOrganization();
  if (organization.value) {
    model = {
      name: organization.value.name,
      identification: organization.value.identification,
      address: organization.value.address,
    };
  } else {
    model = {};
  }
  loading.value = false;
};

const onSubmit = async (data: any) => {
  let success = false;

  if (organization.value?.id) {
    success = await edit(organization.value.id, data);
  } else {
    success = await create(data);
  }

  if (success) {
    notifications.addNotification({
      type: "success",
      title: `${moduleName} guardada`,
      text: `La ${moduleName} se ha guardado correctamente`,
    });
    editing.value = false;
    await loadOrganization();
  } else {
    notifications.addNotification({
      type: "error",
      title: "Error",
      text: `No se ha podido guardar la ${moduleName}`,
    });
  }
};

const cancelEdit = () => {
  editing.value = false;
};

const startEdit = () => {
  editing.value = true;
};

onMounted(async () => {
  await loadOrganization();
  if (!organization.value) {
    editing.value = true;
  }
});
</script>

<template>
  <div class="h-full px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow text-blue-900">
          {{ moduleName }}
        </p>
        <p class="text-gray-500 mt-1">Datos de la organización</p>
      </div>
    </div>

    <DLoading v-if="loading" message="Cargando datos..." />

    <!-- View Mode -->
    <div v-else-if="!editing" class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-blue-900">
          Información de la organización
        </h2>
        <DBtn type="button" color="default" @click="startEdit"> Editar </DBtn>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-500">
            Razón Social / Nombre
          </span>
          <span class="text-base mt-1">
            {{ organization?.name || "—" }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-500">
            Identificación
          </span>
          <span class="text-base mt-1">
            {{ organization?.identification || "—" }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-500">
            Dirección Principal
          </span>
          <span class="text-base mt-1">
            {{ organization?.address || "—" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <DynamicForm
      v-else-if="!loading"
      :form-schema="form"
      :initial-model="model"
      :title-btn-save="organization?.id ? 'Actualizar' : 'Guardar'"
      @cancel="cancelEdit"
      @submit="onSubmit"
    />
  </div>
</template>
