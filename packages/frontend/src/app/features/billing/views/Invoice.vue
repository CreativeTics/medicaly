<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import OrderForBilling from '../components/OrderForBilling.vue'

// import Popper from 'vue3-popper'
import { useRoute, useRouter } from 'vue-router'

import { useBillingStore } from '@/store/billing'
import { DBtn } from '@components/basic'
import OrderForBillingHeader from '../components/OrderForBillingHeader.vue'
import InvoiceHeader from '../components/InvoiceHeader.vue'

import { getInvoice, changeInvoiceNumber } from '../services/invoices'
import { formatCurrency } from '@/app/core/util/currencies'
import { downloadInvoiceOrdersReport } from '../services/ordersReport'
import { useNotificationsStore } from '@/store/notifications'

const router = useRouter()
const route = useRoute()

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

const invoice = ref<any>(null)
onMounted(async () => {
  if (route.params.id) {
    invoice.value = await getInvoice(route.params.id.toString())
    allOrders.value = invoice.value.orders
  }
})

const back = () => {
  if (useBillingStore().activeAccount) {
    useBillingStore().resetActiveAccount()
    router.replace({
      name: 'billing.customers',
    })
    return
  }
  router.back()
}

const handleDownload = async () => {
  console.log('download')
  await downloadInvoiceOrdersReport(invoice.value)
}

const handleInvoiceNumberChange = async (invoiceNumber: string) => {
  console.log('invoiceNumber', invoiceNumber)

  try {
    await changeInvoiceNumber(invoice.value.id, invoiceNumber)

    useNotificationsStore().addNotification({
      type: 'success',
      title: 'Factura actualizada',
      text: 'Número de factura actualizado',
      time: 5000,
    })
  } catch (error) {
    console.error(error)
  }
  await changeInvoiceNumber(invoice.value.id, invoiceNumber)
}
</script>

<template>
  <div class="w-full h-full px-5 flex flex-col">
    <div class="bg-gray-50 pb-4 flex justify-between">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow">Factura</p>
        <p class="text-gray-500 text-shadow"></p>
      </div>
    </div>

    <InvoiceHeader
      :invoice="invoice"
      @download="handleDownload"
      @change-invoice-number="handleInvoiceNumberChange"
    />

    <OrderForBillingHeader />
    <ul class="flex-1 overflow-auto scroll">
      <li v-for="order in filteredOrders" :key="order">
        <OrderForBilling :order="order"> </OrderForBilling>
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
    </div>
  </div>
</template>
