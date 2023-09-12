<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getOrder } from '../services'
import DBtn from '@components/basic/DBtn.vue'
import ServiceAttention from '../components/ServiceAttention.vue'

const route = useRoute()
const router = useRouter()

const order = ref<any>({})
const loading = ref(false)

const back = () => {
  console.log('Back')
  router.back()
}

onMounted(async () => {
  if (route.params.id) {
    loading.value = true
    order.value = await getOrder(route.params.id.toString())
    loading.value = false
  }
})

function scrollTo(id: string) {
  const element = document.getElementById(id) as HTMLDivElement
  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="w-full h-full px-5 flex flex-col">
    <!-- header -->
    <div class="bg-gray-50 flex justify-between">
      <p
        class="text-3xl flex items-center gap-5 font-semibold text-shadow text-blue-900"
      >
        Orden # {{ order.code }}

        <span class="text-lg font-semibold"
          >{{ order.medicalExamType?.name }} :
          {{ order.medicalExamType?.emphasis }}
        </span>
      </p>
      <div class="flex">
        <div
          class="text-lg font-semibold text-gray-900 p-3 flex flex-col items-end"
        >
          {{ order.patientName }}
          <span class="text-sm font-normal text-gray-500">
            23 años 14 dias</span
          >
          <span class="text-sm font-normal text-gray-500"> Masculino</span>
        </div>
        <div class="rounded-full h-24 w-24 bg-white"></div>
      </div>
    </div>
    <!-- services -->
    <div class="w-full flex-grow flex overflow-y-hidden">
      <div class="w-28 flex flex-col justify-center items-center">
        <div
          v-for="service in order.services"
          class="bg-white w-28 rounded-lg shadow-xl shadow-cyan-400 flex justify-center items-center h-10 mb-2 cursor-pointer"
          @click="scrollTo(service.id)"
        >
          {{ service.name }}
        </div>
      </div>
      <div
        class="flex-grow h-full rounded-xl bg-white shadow-lg p-5 flex flex-col overflow-y-scroll"
      >
        <ServiceAttention
          v-for="service in order.services"
          :id="service.id"
          :orderId="order.id"
          :patientDataId="order.patientDataId"
          :serviceId="service.id"
        />

        <hr />
      </div>
      <div
        class="absolute right-0 top-96 bg-white w-28 rounded-lg shadow-lg shadow-blue-800"
      >
        otras anotaciones anteriores
      </div>
    </div>
    <!-- footer -->
    <div class="w-full h-14 flex items-center bg-white">
      <DBtn @click="back" class="bg-gray-300 hover:bg-gray-400">Atras</DBtn>
    </div>
  </div>
</template>
