<script setup lang="ts">
import { ref } from 'vue'
import { DBtn } from '@components/basic'
const PaginatedTable = () => import('@components/PaginatedTable.vue')

const columns = [
  {
    key: 'id',
    title: 'ID',
    align: 'left',
  },
  {
    key: 'name',
    title: 'Name',
    align: 'left',
  },
  {
    key: 'email',
    title: 'Email',
    align: 'left',
  },
]

const data = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@example.com',
  },
]

for (let i = 0; i < 100; i++) {
  data.push({
    id: i + 4,
    name: `John Doe ${i}`,
    email: 'john.smith@example.com',
  })
}

const table = ref<any>(null)

const randomize = () => {
  table.value.selectedRows = []
  table.value.selectedAllRows = false
  data.forEach((item) => {
    const setValue = Math.floor(Math.random() * 4)
    if (setValue) table.value.selectedRows.push(item.id)
  })
}
</script>
<template>
  <div class="" style="height: 1000px">
    <div>
      <DBtn @click="randomize">Randomize</DBtn>
    </div>
    <PaginatedTable
      ref="table"
      :columns="columns"
      :rows="data"
      :enable-select-rows="true"
    />
  </div>
</template>
