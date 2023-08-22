<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getOrder } from '../services'
import OrderStatus from '../../service-orders/components/OrderStatus.vue'
import DBtn from '@components/basic/DBtn.vue'

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
</script>

<template>
  <div class="w-full h-full px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p
          class="text-3xl flex items-center gap-5 font-semibold text-shadow text-blue-900"
        >
          Orden # {{ order.code }}
          <OrderStatus :status="order.status" class="text-lg" />
        </p>
      </div>
    </div>

    <div
      class="w-full h-full mt-5 bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3"
    >
      <span class="text-lg font-semibold"
        >{{ order.medicalExamType?.name }} :
        {{ order.medicalExamType?.emphasis }}
      </span>

      <hr />
      <div class="pt-5 flex justify-end">
        <DBtn @click="back" class="bg-gray-300 hover:bg-gray-400">Atras</DBtn>
      </div>
    </div>
  </div>
</template>
