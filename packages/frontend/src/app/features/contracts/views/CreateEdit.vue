<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Form, DynamicForm } from "../../dynamic-form";
import { useNotificationsStore } from "@/store/notifications";
import { create, getEntity, edit } from "../services";

import SubsidiaryList from "../components/SubsidiaryList.vue";

const notifications = useNotificationsStore();
const moduleName = "Contrato";
const modulePath = "contracts";

const route = useRoute();
const router = useRouter();

let model = {};
const loading = ref(false);

const form: Form = {
  entity: modulePath,
  tabs: [
    {
      name: "Datos",
      groups: [
        {
          name: "Información basica",
          description: "Esta es la información basica del contrato.",
          fields: [
            {
              name: "status",
              label: "Estado",
              type: "select",
              props: {
                required: true,
                class: "lg:col-span-1 xl:col-span-1",
                options: [
                  { id: "active", name: "Activo" },
                  { id: "inactive", name: "Inactivo" },
                ],
              },
              default: "active",
              rules: ["required"],
            },
            {
              name: "documentNumber",
              label: "No. Documento",
              type: "text",
              props: {
                placeholder: "No. Documento",
                class: "lg:col-span-1 xl:col-span-1",
                required: true,
              },
              rules: ["required", "integer", "minlength:3", "maxlength:50"],
            },
            {
              name: "name",
              label: "Nombre",
              type: "text",
              props: {
                placeholder: "Nombre",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:50"],
            },
            {
              name: "billingCode",
              label: "Codigo de facturación",
              type: "text",
              props: {
                placeholder: "Codigo de facturación",
                required: true,
              },
              rules: ["required", "upper", "minlength:3", "maxlength:50"],
            },
            {
              name: "legalRepresentative",
              label: "Representante legal",
              type: "text",
              props: {
                placeholder: "Representante legal",
                required: true,
              },
              rules: [
                "required",
                "alphanumeric",
                "minlength:3",
                "maxlength:50",
              ],
            },
            {
              name: "email",
              label: "Email",
              type: "text",
              props: {
                placeholder: "email@example.com",
                required: true,
              },
              rules: ["required", "email"],
            },
            {
              name: "phone",
              label: "Telefono",
              type: "text",
              props: {
                placeholder: "Telefono",
                required: true,
              },
              rules: ["required", "integer", "minlength:6", "maxlength:20"],
            },
            {
              name: "city",
              label: "Ciudad",
              type: "select",
              props: {
                required: true,
              },
              rules: ["required"],
              query: {
                entity: "general:cities",
                fields: ["id", "name"],
              },
            },
            {
              name: "address",
              label: "Dirección",
              type: "text",
              props: {
                placeholder: "Dirección",
                class: "lg:col-span-4 xl:col-span-4",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:100"],
            },
            {
              name: "observations",
              label: "Observaciones",
              type: "textarea",
              props: {
                rows: 3,
                placeholder: "Observaciones",
                class: "lg:col-span-6 xl:col-span-6",
              },
              rules: ["maxlength:500"],
            },
          ],
        },
      ],
    },
  ],
};

const onSubmit = async (data: any) => {
  console.log("Submit", data);

  if (route.params.id === undefined) {
    console.log("Create");
    if (await create(data)) {
      notifications.addNotification({
        type: "success",
        title: `${moduleName} creado`,
        text: `El ${moduleName} se ha creado correctamente`,
      });
      router.push({ name: `${modulePath}.list` });
    } else {
      notifications.addNotification({
        type: "error",
        title: "Error",
        text: `No se ha podido crear el ${moduleName}`,
      });
    }
  } else {
    if (await edit(route.params.id as string, data)) {
      notifications.addNotification({
        type: "success",
        title: `${moduleName} actualizado`,
        text: `El ${moduleName} se ha actualizado correctamente`,
      });
      router.push({ name: `${modulePath}.list` });
    } else {
      notifications.addNotification({
        type: "error",
        title: "Error",
        text: `No se ha podido actualizar el ${moduleName}`,
      });
    }
  }
};

const back = () => {
  console.log("Back");
  router.push({ name: `${modulePath}.list` });
};

onBeforeMount(async () => {
  loading.value = true;

  console.log("Mounted", route.params.id);
  if (route.params.id) {
    model = await getEntity(route.params.id as string);
    console.log("Model", model);
  }
  loading.value = false;
});
</script>

<template>
  <div class="h-full overflow-x-scroll px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow text-blue-900">
          {{ route.params.id == undefined ? "Crear" : "Editar" }}
          {{ moduleName }}
        </p>
      </div>
    </div>
    <div class="form overflow-auto">
      <DynamicForm
        v-if="form?.tabs && !loading"
        :form-schema="form"
        :initial-model="model"
        :title-btn-save="
          route.params.id === undefined ? 'Guardar' : 'Actualizar'
        "
        :fixed-height="false"
        @cancel="back"
        @submit="onSubmit"
      />
      <Suspense>
        <SubsidiaryList :id="route.params.id" />
        <template #fallback> Cargando Sedes </template>
      </Suspense>
      <Suspense>
        <SubsidiaryList :id="route.params.id" />
        <template #fallback> Cargando Sedes </template>
      </Suspense>
      <Suspense>
        <SubsidiaryList :id="route.params.id" />
        <template #fallback> Cargando Sedes </template>
      </Suspense>
    </div>
  </div>
</template>
<style scoped>
.form {
  height: calc(100vh - 10rem);
}
</style>
