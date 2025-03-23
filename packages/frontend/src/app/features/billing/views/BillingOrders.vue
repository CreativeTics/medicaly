<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import OrderForBilling from '../components/OrderForBilling.vue'

// import Popper from 'vue3-popper'
import { useRouter } from 'vue-router'

import { useBillingStore } from '@/store/billing'
import { formatDate } from '@/app/core/util/dates'
import { DBtn, DSelectFieldSearch } from '@components/basic'
import OrderForBillingHeader from '../components/OrderForBillingHeader.vue'
import Popper from 'vue3-popper'
import { Building07Icon, XIcon } from '@components/basic/icons'

import {
  getContractList,
  getContractSubsidiaries,
  changeContractSubsidiary,
  loadOrdersFormIds,
} from '../services'
import { createInvoice } from '../services/invoices'
import { useNotificationsStore } from '@/store/notifications'
import { formatCurrency } from '@/app/core/util/currencies'

const router = useRouter()
const modalIsOpen = ref(false)
const activeAccount = useBillingStore().activeAccount

const contracts = ref<any[]>([])
const contractSubsidiaries = ref<any[]>([])

const changeContract = ref<{
  orderId: string
  orderCode: string
  contractId: string
  subsidiaryId: string
}>({
  orderId: '',
  orderCode: '',
  contractId: '',
  subsidiaryId: '',
})
const actualContractSubsidiaries = ref<any[]>([])
const selectedContractSubsidiary = ref<string>('')
const allOrders = ref<any[]>([])
const filteredOrders = computed(() => {
  return allOrders.value.filter(
    (order) =>
      !selectedContractSubsidiary.value ||
      order.contractSubsidiaryId === selectedContractSubsidiary.value
  )
})
const totalAmount = computed(() => {
  return filteredOrders.value.reduce((acc, order) => {
    return acc + order.totalAmount
  }, 0)
})

onMounted(async () => {
  if (!activeAccount?.orders) return
  allOrders.value = await loadOrdersFormIds(activeAccount?.orders)

  actualContractSubsidiaries.value = await getContractSubsidiaries(
    activeAccount?.contractId
  )
})

const back = () => {
  useBillingStore().resetActiveAccount()
  router.back()
}

// modal
const openChangeContractModal = async (orderId: string) => {
  contracts.value = await getContractList()
  changeContract.value.orderId = orderId
  modalIsOpen.value = true
}

const closeChangeContractModal = () => {
  changeContract.value.orderId = ''
  modalIsOpen.value = false
}

const loadContractSubsidiaries = async (contractId: string) => {
  contractSubsidiaries.value = await getContractSubsidiaries(contractId)
}

const handleContractChange = async () => {
  if (!changeContract.value.contractId || !changeContract.value.subsidiaryId) {
    useNotificationsStore().addNotification({
      title: 'Error',
      text: 'Debe seleccionar un contrato y una sede!',
      type: 'error',
      time: 5000,
    })
    return
  }

  try {
    await changeContractSubsidiary(
      changeContract.value.orderId,
      changeContract.value.subsidiaryId
    )

    if (activeAccount?.contractId !== changeContract.value.contractId) {
      useBillingStore().removeOrder(changeContract.value.orderId)
    }
    useNotificationsStore().addNotification({
      title: 'Orden modificada',
      text: 'La orden ha sido modificada con éxito!',
      type: 'success',
      time: 5000,
    })
    router.replace('/billing/orders')
  } catch (err: any) {
    useNotificationsStore().addNotification({
      title: 'Error',
      text: err.message,
      type: 'error',
      time: 5000,
    })
  }
  changeContract.value.orderId = ''
  changeContract.value.subsidiaryId = ''
  changeContract.value.contractId = ''
  closeChangeContractModal()
}

const handleCreateInvoice = async () => {
  try {
    if (!activeAccount) throw new Error('No se ha seleccionado una cuenta!')

    if (!filteredOrders.value.length)
      throw new Error('No hay ordenes para facturar!')

    const invoiceId = await createInvoice(activeAccount, filteredOrders.value)
    useNotificationsStore().addNotification({
      title: 'Factura creada',
      text: 'La factura ha sido creada con éxito!',
      type: 'success',
      time: 5000,
    })
    router.push(`/billing/invoices/${invoiceId}`)
  } catch (err: any) {
    useNotificationsStore().addNotification({
      title: 'Error',
      text: err.message,
      type: 'error',
      time: 5000,
    })
  }
}
</script>

<template>
  <div class="w-full h-full px-5 flex flex-col">
    <div class="bg-gray-50 pb-4 flex justify-between">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">
          Facturación:
          <span class="text-blue-700">
            {{ activeAccount?.subsidiaryName }} -
            {{ activeAccount?.contractName }}
          </span>
        </p>
        <p class="text-gray-500 text-shadow">
          Desde {{ formatDate(activeAccount?.filters?.startDate || '') }} hasta
          {{ formatDate(activeAccount?.filters?.endDate || '') }}
        </p>
      </div>
      <div class="flex justify-end items-end">
        <DSelectFieldSearch
          label="Sede:"
          v-model="selectedContractSubsidiary"
          :options="actualContractSubsidiaries"
          class="min-w-fit w-96"
        />
      </div>
    </div>

    <OrderForBillingHeader />
    <ul class="flex-1 overflow-auto scroll">
      <li v-for="order in filteredOrders" :key="order">
        <OrderForBilling :order="order">
          <Popper
            arrow
            offsetDistance="12"
            content="Cambiar Sede"
            :hover="true"
            placement="left"
            class="tooltip"
          >
            <div
              class="bg-gray-50 rounded-md py-2"
              @click="openChangeContractModal(order.id)"
            >
              <Building07Icon
                class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
              />
            </div>
          </Popper>
        </OrderForBilling>
      </li>
    </ul>

    <!-- footer -->
    <div class="w-full py-2 px-5 flex items-center justify-end bg-white">
      <span class="text-sm font-semibold">
        TOTAL:
        {{ formatCurrency(totalAmount) }}
        ( {{ filteredOrders.length }} Ordenes)
      </span>
    </div>
    <div class="w-full py-2 px-5 flex items-center justify-between bg-white">
      <DBtn @click="back" class="bg-gray-300 hover:bg-gray-400">Atrás</DBtn>
      <DBtn @click="handleCreateInvoice">Crear Factura</DBtn>
    </div>
  </div>

  <div
    v-show="modalIsOpen"
    class="fixed w-screen h-screen p-10 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative bg-white rounded-2xl p-5">
      <div
        class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-gray-50 text-gray-500 p-3"
        @click="closeChangeContractModal"
      >
        <XIcon class="w-6 h-6 cursor-pointer" />
      </div>
      <div class="py-3 flex flex-col gap-5 items-center">
        <p class="text-lg font-semibold">Cambiar Sede</p>
        <DSelectFieldSearch
          label="Contrato:"
          v-model="changeContract.contractId"
          :options="contracts"
          @change="loadContractSubsidiaries"
          class="min-w-fit w-96"
        />
        <DSelectFieldSearch
          label="Sede:"
          v-model="changeContract.subsidiaryId"
          :options="contractSubsidiaries"
          class="min-w-fit w-96"
        />

        <DBtn @click="handleContractChange" class="w-full">Cambiar</DBtn>
      </div>
    </div>
  </div>
</template>
