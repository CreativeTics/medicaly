<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { OrderStatus as OrderStatusEnum } from '@/app/core/types/order-status'
import { useNotificationsStore } from '@/store/notifications'
import OrderStatus from '../components/OrderStatus.vue'
import { getOrder } from '../services'

import { DBtn } from '@components/basic'
import {
  FileAttachment01Icon as ExamIcon,
  RefreshCcw01Icon,
  Trash01Icon,
  XIcon,
} from '@components/basic/icons'
import Popper from 'vue3-popper'
import OrderCycle from '../components/OrderCycle.vue'

const notifications = useNotificationsStore()
const route = useRoute()
const router = useRouter()

const order = ref<any>({})
const loading = ref(false)

// modal
const modalActive = ref(false)

const closeModal = () => {
  modalActive.value = false
}

const back = () => {
  router.back()
}

onMounted(async () => {
  if (route.params.id) {
    loading.value = true
    order.value = await getOrder(route.params.id.toString())
    loading.value = false
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
})
</script>

<template>
  <div class="h-full px-5">
    <div class="bg-gray-50 pb-4 flex items-center justify-between">
      <div class="leading-4 pt-responsive">
        <p
          class="text-3xl flex items-center gap-5 font-semibold text-shadow text-blue-900"
        >
          Orden # {{ order.code }}
          <OrderStatus :status="order.status" class="text-lg" />

          <Popper
            v-if="order.status === OrderStatusEnum.completed"
            arrow
            offsetDistance="12"
            content="Reabrir orden"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div
              class="bg-gray-100 rounded-md py-2"
              @click="modalActive = true"
            >
              <RefreshCcw01Icon
                class="h-6 w-6 mx-2 cursor-pointer text-blue-600"
              />
            </div>
          </Popper>
          <Popper
            v-if="
              order.status === OrderStatusEnum.pending ||
              order.status === OrderStatusEnum.inprogress
            "
            arrow
            offsetDistance="12"
            content="Anular orden"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div class="bg-gray-100 rounded-md py-2">
              <Trash01Icon class="h-6 w-6 mx-2 cursor-pointer text-red-600" />
            </div>
          </Popper>
        </p>
      </div>
      <OrderCycle :orderCycle="order.orderCycle" />
    </div>
    <div class="w-full bg-white rounded-lg shadow-lg p-5 flex gap-5">
      <div class="flex items-center gap-5 w-1/3">
        <div class="flex flex-col">
          <span class="font-semibold">Contrato </span>
          <span class="font-semibold">Sede </span>
          <span class="font-semibold">Centro de costo </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm">
            {{ order?.contractName }}
          </span>
          <span class="text-sm">
            {{ order?.contractSubsidiary?.name }}
          </span>
          <span class="text-sm">
            {{ order?.contractCostCenter?.name }}
          </span>
        </div>
      </div>
      <div class="w-full">
        <div class="flex items-center gap-5">
          <div class="flex flex-col">
            <span class="font-semibold">PACIENTE </span>
            <span class="font-semibold">Nombre </span>
            <span class="font-semibold">Documento</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm">&nbsp; </span>
            <span class="text-lg font-semibold">
              {{ order?.patientName }}
            </span>
            <span class="text-sm">{{ order.patientDocumentNumber }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full mt-5 bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3"
    >
      <span class="text-lg font-semibold flex gap-4">
        <ExamIcon />
        {{ order.medicalExamType?.name }} :
        {{ order.medicalExamType?.emphasis }}
      </span>

      <div class="w-full">
        <table class="w-full table table-auto">
          <thead>
            <tr>
              <th class="text-left">Código</th>
              <th class="text-left">Nombre</th>
              <th class="text-left">Estado</th>
              <th
                class="text-left"
                v-if="
                  order.status === OrderStatusEnum.pending ||
                  order.status === OrderStatusEnum.inprogress
                "
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="service in order?.services"
              :key="service.code"
              class="hover:bg-gray-50 h-10"
            >
              <td>
                <span class="text-sm">{{ service.code }}</span>
              </td>
              <td>
                <span class="text-sm">{{ service.name }}</span>
              </td>
              <td>
                <span class="text-sm">
                  <OrderStatus :status="service.status" class="text-lg"
                /></span>
              </td>
              <td
                v-if="
                  order.status === OrderStatusEnum.pending ||
                  order.status === OrderStatusEnum.inprogress
                "
              >
                <Popper
                  v-if="
                    service.status === OrderStatusEnum.pending ||
                    service.status === OrderStatusEnum.inprogress
                  "
                  arrow
                  offsetDistance="12"
                  content="Anular Servicio"
                  :hover="true"
                  placement="top"
                  class="tooltip"
                >
                  <div class="bg-gray-100 rounded-md py-2">
                    <Trash01Icon
                      class="h-6 w-6 mx-2 cursor-pointer text-red-600"
                    />
                  </div>
                </Popper>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />
      <div class="pt-5 flex justify-end">
        <DBtn @click="back" class="bg-gray-300 hover:bg-gray-400">Atras</DBtn>
      </div>
    </div>

    <div
      v-show="modalActive"
      class="fixed w-screen h-screen p-10 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="relative w-1/6 bg-white rounded-2xl p-5">
        <div
          class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-gray-50 text-gray-500 p-3"
          @click="closeModal"
        >
          <XIcon class="w-6 h-6 cursor-pointer" />
        </div>
        <div class="w-full h-full flex flex-col items-center justify-center">
          <div>
            <span class="text-lg font-semibold">Reabrir Orden</span>
          </div>
          <hr />
          <div class="text-sm text-gray-500">
            ¿Está seguro de que desea reabrir la orden?
          </div>
          <div class="flex gap-3 mt-5">
            <DBtn @click="closeModal" class="bg-gray-300 hover:bg-gray-400">
              Cancelar
            </DBtn>
            <DBtn class="bg-blue-600 hover:bg-blue-700 text-white">
              Reabrir
            </DBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
