<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Form, DynamicForm } from "../../../dynamic-form";
import { useNotificationsStore } from "@/store/notifications";

import { create, getRole, edit } from "../services";

const notifications = useNotificationsStore();

const route = useRoute();
const router = useRouter();

let model = {};
const loading = ref(false);

const form: Form = {
  entity: "roles",
  tabs: [
    {
      name: "General",
      groups: [
        {
          name: "General",
          fields: [
            {
              name: "name",
              label: "Nombre",
              type: "text",
              props: {
                rows: 3,
                placeholder: "Nombre",
                required: true,
              },
              rules: ["required", "minlength:3", "maxlength:50"],
            },
            {
              name: "permissions",
              label: "Permisos",
              type: "multiselect",
              props: {
                required: true,
              },
              rules: ["required-array"],
              query: {
                entity: "permissions",
                fields: ["id", "name"],
                orderBy: ["name", "asc"],
              },
            },
            {
              name: "description",
              label: "Descripción",
              type: "textarea",
              props: {
                rows: 3,
                placeholder: "Description",
                class: "lg:col-span-6 xl:col-span-6",
              },
              rules: ["maxlength:300"],
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
        title: "Rol creado",
        text: "El rol se ha creado correctamente",
      });
      router.push({ name: "roles.list" });
    } else {
      notifications.addNotification({
        type: "error",
        title: "Error",
        text: "No se ha podido crear el rol",
      });
    }
  } else {
    if (await edit(route.params.id as string, data)) {
      notifications.addNotification({
        type: "success",
        title: "Rol actualizado",
        text: "El rol se ha actualizado correctamente",
      });
      router.push({ name: "roles.list" });
    } else {
      notifications.addNotification({
        type: "error",
        title: "Error",
        text: "No se ha podido actualizar el rol",
      });
    }
  }
};

const back = () => {
  console.log("Back");
  router.push({ name: "roles.list" });
};

onBeforeMount(async () => {
  loading.value = true;

  console.log("Mounted", route.params.id);
  if (route.params.id) {
    model = await getRole(route.params.id as string);
    console.log("Model", model);
  }
  loading.value = false;
});
</script>

<template>
  <div class="h-full px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow text-blue-900">
          {{ route.params.id == undefined ? "Crear" : "Editar" }}
          Rol
        </p>
      </div>
    </div>
    <DynamicForm
      v-if="form?.tabs && !loading"
      :form-schema="form"
      :initial-model="model"
      :title-btn-save="route.params.id === undefined ? 'Guardar' : 'Actualizar'"
      @cancel="back"
      @submit="onSubmit"
    />
  </div>
</template>
