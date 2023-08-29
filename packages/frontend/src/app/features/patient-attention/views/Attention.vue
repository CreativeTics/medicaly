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
  <div class="w-full h-full px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p
          class="text-3xl flex items-center gap-5 font-semibold text-shadow text-blue-900"
        >
          Orden # {{ order.code }}

          <span class="text-lg font-semibold"
            >{{ order.medicalExamType?.name }} :
            {{ order.medicalExamType?.emphasis }}
          </span>
        </p>
      </div>
    </div>

    <div class="w-full flex items-center">
      <div class="w-28">
        <div
          v-for="service in order.services"
          class="bg-white w-28 rounded-lg shadow-xl shadow-cyan-400 flex justify-center items-center h-10 mb-2 cursor-pointer"
          @click="scrollTo(service.id)"
        >
          {{ service.name }}
        </div>
      </div>
      <div
        class="w-full mt-5 bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3 overflow-y-scroll relative"
        style="height: calc(100vh - 100px)"
      >
        <div v-for="service in order.services" class="" :id="service.id">
          <Suspense>
            <ServiceAttention :orderId="order.id" :serviceId="service.id" />
          </Suspense>
        </div>

        <hr />
        <div class="pt-5 flex justify-end">
          <DBtn @click="back" class="bg-gray-300 hover:bg-gray-400">Atras</DBtn>
        </div>
      </div>
      <div
        class="absolute right-0 top-96 bg-white w-28 rounded-lg shadow-lg shadow-blue-800"
      >
        <a href="#17fe4e80ba0df8dc3f0ac1c142008767"> otras anotaciones </a>
      </div>
    </div>
  </div>
</template>
