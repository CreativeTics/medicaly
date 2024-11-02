<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAttentionStore } from '@/store/patient-attention'

import { getOrder, getFinalizeOrderPermission } from '../services'
import { finalizeOrder } from '../services/services'
import DBtn from '@components/basic/DBtn.vue'
import DModal from '@components/basic/DModal.vue'
import ServiceAttention from '../components/ServiceAttention.vue'
import Popper from 'vue3-popper'
import { useNotificationsStore } from '@/store/notifications'

import { CheckCircleIcon } from '@components/basic'

import PatientHeader from '../components/PatientHeader.vue'

const attentionStore = useAttentionStore()

const route = useRoute()
const router = useRouter()

const notifications = useNotificationsStore()

const order = ref<any>({})
const loading = ref(false)
const modalIsOpen = ref(false)
const allowFinalizeOrder = ref(false)

const back = () => {
  console.log('Back')
  router.back()
}

onMounted(async () => {
  if (route.params.id) {
    loading.value = true
    order.value = await getOrder(route.params.id.toString())

    attentionStore.loadOrder(order.value.code, order.value.services)

    allowFinalizeOrder.value = await getFinalizeOrderPermission()

    loading.value = false
  }
})

async function finalize(id: string) {
  if (!allowFinalizeOrder) return
  loading.value = true
  try {
    await finalizeOrder(id)
    notifications.addNotification({
      title: 'Orden finalizada',
      text: 'La orden ha sido finalizada con exito',
      type: 'success',
      time: 5000,
    })
    router.replace('/patient-attention')
  } catch (err: any) {
    notifications.addNotification({
      title: 'Error',
      text: err.message,
      type: 'error',
      time: 5000,
    })
  }
  modalIsOpen.value = false
  loading.value = false
}
</script>

<template>
  <div class="w-full h-full px-5 flex flex-col">
    <!-- header -->
    <div class="bg-gray-50 flex justify-between">
      <p
        class="text-3xl flex items-center gap-5 font-semibold text-shadow text-blue-900"
      >
        {{ order.code }}

        <span class="text-lg font-semibold"
          >{{ order.medicalExamType?.name }} :
          {{ order.medicalExamType?.emphasis }}
        </span>
      </p>
      <PatientHeader
        v-if="order.patientDataId"
        :patientDataId="order.patientDataId"
        :patientName="order.patientName"
        :contractName="order.contractName"
        :positionId="order.position"
      />
    </div>
    <!-- services -->
    <div class="w-full flex-grow flex overflow-y-hidden">
      <div
        class="flex-grow h-full rounded-xl bg-white shadow-lg p-5 flex flex-col overflow-y-scroll"
      >
        <ServiceAttention
          v-for="service in order.services"
          :id="service.id"
          :orderId="order.id"
          :patientDataId="order.patientDataId"
          :serviceId="service.id"
          :exams="service.exams"
        />

        <hr />
      </div>
      <div class="absolute right-0 top-96 flex flex-col items-center gap-5">
        <!-- <div class="bg-white w-12 rounded-lg shadow-lg shadow-blue-800">
          otras anotaciones
        </div> -->
        <Popper
          v-if="allowFinalizeOrder && attentionStore.orderISComplete"
          arrow
          offsetDistance="0"
          content="Finalizar orden"
          :hover="true"
          placement="left"
          class="tooltip"
        >
          <div
            class="bg-green-50 p-3 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
            @click="modalIsOpen = true"
          >
            <CheckCircleIcon class="w-8 h-8 text-green-500" />
          </div>
        </Popper>
      </div>
    </div>

    <!-- footer -->
    <div class="w-full h-14 flex items-center bg-white">
      <DBtn @click="back" class="bg-gray-300 hover:bg-gray-400">Atras</DBtn>
    </div>

    <DModal
      :open="modalIsOpen"
      @closeModal="modalIsOpen = false"
      :title="`Finalizar orden #${order.code}`"
      typeAlert="question"
      :description="`¿Esta seguro que desea finalizar la orden #${order.code}?`"
      :nameButtonClose="`Cancelar`"
      :nameButtonAccept="`Finalizar`"
      @otherMethod="finalize(order.id)"
    />
  </div>
</template>
