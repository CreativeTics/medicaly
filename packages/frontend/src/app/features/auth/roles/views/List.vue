<script setup lang="ts">
import ModuleListBasic from "../../../../components/ModuleListBasic.vue";

const columns = [
  {
    key: "id",
    title: "ID",
    align: "left",
  },
  {
    key: "name",
    title: "Name",
    align: "left",
  },
  {
    key: "email",
    title: "Email",
    align: "left",
  },
];

const data = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
  {
    id: 3,
    name: "John Smith",
    email: "john.smith@example.com",
  },
];

for (let i = 0; i < 100; i++) {
  data.push({
    id: i + 4,
    name: `John Doe ${i}`,
    email: "john.smith@example.com",
  });
}
</script>

<template>
  <ModuleListBasic
    title="Roles"
    subtitle="Gestión de Roles"
    :columns="columns"
    :rows="data"
    :actions="['edit', 'delete', 'create']"
  >
  </ModuleListBasic>
</template>
