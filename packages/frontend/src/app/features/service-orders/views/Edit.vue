<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { OrderStatus as OrderStatusEnum } from '@/app/core/types/order-status'
import { useNotificationsStore } from '@/store/notifications'
import OrderStatus from '../components/OrderStatus.vue'
import {
  getOrder,
  cancelOrder,
  reopenOrder,
  addServicesToOrder,
  removeServiceFromOrder,
} from '../services'

import { DBtn, DLoading } from '@components/basic'
import {
  FileAttachment01Icon as ExamIcon,
  RefreshCcw01Icon,
  Trash01Icon,
  DeleteIcon,
} from '@components/basic/icons'
import Popper from 'vue3-popper'
import OrderCycle from '../components/OrderCycle.vue'
import DConfirmationModal from '@components/basic/DConfirmationModal.vue'
import AddServiceModal from '../components/AddServiceModal.vue'

const notifications = useNotificationsStore()
const route = useRoute()
const router = useRouter()

const order = ref<any>({})
const loading = ref(false)

// modal
const showReopenOrderModal = ref(false)
const showCancelOrderModal = ref(false)
const showAddServiceModal = ref(false)
const serviceToDelete = ref<any>(null)
const showDeleteServiceModal = ref(false)

const back = () => {
  router.back()
}

const loadOrder = async () => {
  if (route.params.id) {
    loading.value = true
    order.value = await getOrder(route.params.id.toString())
    loading.value = false
  }
}

onMounted(async () => {
  loadOrder()
})

const handleCancelOrder = async (reason: string) => {
  if (!order.value.id) return

  loading.value = true
  showCancelOrderModal.value = false
  const error = await cancelOrder(order.value.id, reason)
  loading.value = false

  if (error?.error) {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo anular la orden: ' + error?.error,
    })
    console.error(error)
    return
  }

  notifications.addNotification({
    type: 'success',
    title: 'Éxito',
    text: 'Orden anulada correctamente',
  })
  loadOrder()
}

const handleReopenOrder = async (reason: string) => {
  if (!order.value.id) return

  loading.value = true
  const error = await reopenOrder(order.value.id, reason)
  loading.value = false

  if (error?.error) {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo reabrir la orden: ' + error?.error,
    })
    console.error(error)
    return
  }

  notifications.addNotification({
    type: 'success',
    title: 'Éxito',
    text: 'Orden reabierta correctamente',
  })
  loadOrder()
}

const handleAddNewServices = async (servicesToAdd: any[]) => {
  if (!order.value.id) return

  loading.value = true
  showAddServiceModal.value = false
  const error = await addServicesToOrder(order.value.id, servicesToAdd)
  loading.value = false

  if (error?.error) {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo agregar los servicios a la orden: ' + error?.error,
    })
    console.error(error)
    return
  }

  notifications.addNotification({
    type: 'success',
    title: 'Éxito',
    text: 'Servicios agregados correctamente',
  })
  loadOrder()
}

const handleDeleteService = async (reason: string) => {
  if (!order.value.id || !serviceToDelete.value) return

  loading.value = true
  showDeleteServiceModal.value = false
  const error = await removeServiceFromOrder(
    order.value.id,
    serviceToDelete.value.id,
    reason
  )
  loading.value = false

  if (error?.error) {
    notifications.addNotification({
      type: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el servicio de la orden: ' + error?.error,
    })
    console.error(error)
    return
  }

  notifications.addNotification({
    type: 'success',
    title: 'Éxito',
    text: 'Servicio eliminado correctamente',
  })
  serviceToDelete.value = null
  loadOrder()
}
</script>

<template>
  <DLoading v-if="loading" message="procesando..." />
  <div class="h-full px-5">
    <div class="bg-gray-50 flex items-center justify-between">
      <div class="leading-4 pt-responsive">
        <p
          class="text-3xl flex items-center gap-5 font-semibold text-shadow text-blue-900"
        >
          Orden # {{ order.code }}
          <OrderStatus :status="order.status" class="text-lg" />

          <Popper
            v-if="
              order.status === OrderStatusEnum.completed ||
              order.status === OrderStatusEnum.cancelled
            "
            arrow
            offsetDistance="12"
            content="Reabrir orden"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div
              class="bg-gray-100 rounded-md py-2"
              @click="showReopenOrderModal = true"
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
            <div
              class="bg-gray-100 rounded-md py-2"
              @click="showCancelOrderModal = true"
            >
              <DeleteIcon class="h-6 w-6 mx-2 cursor-pointer text-red-600" />
            </div>
          </Popper>
        </p>
      </div>
      <OrderCycle :orderCycle="order.orderCycle" />
    </div>
    <div class="w-full pt-1 flex flex-col gap-2">
      <div
        class="w-full bg-white rounded-lg shadow-sm p-3 flex items-center gap-5"
      >
        <span class="font-semibold">Paciente: </span>
        <span class="text-sm">{{ order?.patientName }}</span>
      </div>

      <div
        class="w-full bg-white rounded-lg shadow-sm p-3 flex flex-wrap gap-5"
      >
        <div>
          <span class="font-semibold">Contrato </span>
          <span class="text-sm">{{ order?.contractName }}</span>
        </div>
        <div>
          <span class="font-semibold">Sede </span>
          <span class="text-sm">{{ order?.contractSubsidiary?.name }}</span>
        </div>
        <div>
          <span class="font-semibold">Centro de costo </span>
          <span class="text-sm">{{ order?.contractCostCenter?.name }}</span>
        </div>
        <div class="flex items-center justify-end flex-1">
          <!-- <DBtn @click="">Cambiar contrato</DBtn> -->
        </div>
      </div>
      <div class="w-full bg-white rounded-lg shadow-lg p-3 flex flex-col gap-3">
        <span class="text-xs font-semibold flex items-center gap-4">
          <ExamIcon />
          Tipo de examen:
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
                    content="Eliminar Servicio"
                    :hover="true"
                    placement="top"
                    class="tooltip"
                  >
                    <div
                      class="bg-gray-100 rounded-md py-2"
                      @click="
                        ;(serviceToDelete = service),
                          (showDeleteServiceModal = true)
                      "
                    >
                      <Trash01Icon
                        class="h-6 w-6 mx-2 cursor-pointer text-red-600"
                      />
                    </div>
                  </Popper>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="
              order.status === OrderStatusEnum.pending ||
              order.status === OrderStatusEnum.inprogress
            "
            class="flex items-center justify-center flex-1 mt-4"
          >
            <DBtn @click="showAddServiceModal = true">Agregar Servicios</DBtn>
          </div>
        </div>

        <hr />
        <div class="pt-5 flex justify-end">
          <DBtn @click="back" class="bg-gray-300 hover:bg-gray-400">Atrás</DBtn>
        </div>
      </div>
    </div>

    <DConfirmationModal
      v-if="showReopenOrderModal"
      title="Reabrir Orden"
      message="¿Está seguro de que desea reabrir la orden?"
      bottomColor="danger"
      :requireReason="true"
      @close="showReopenOrderModal = false"
      @confirm="handleReopenOrder"
    />
    <DConfirmationModal
      v-if="showCancelOrderModal"
      title="Anular Orden"
      message="¿Está seguro de que desea anular la orden?"
      bottomColor="danger"
      :requireReason="true"
      @close="showCancelOrderModal = false"
      @confirm="handleCancelOrder"
    />
    <AddServiceModal
      v-if="showAddServiceModal"
      :contractId="order.contract"
      :orderServicesIds="order.services?.map((_: any) => _.id)"
      @close="showAddServiceModal = false"
      @confirm="handleAddNewServices"
    />
    <DConfirmationModal
      v-if="showDeleteServiceModal"
      title="Eliminar Servicio"
      :message="`¿Está seguro de que desea eliminar el servicio ${
        serviceToDelete ? serviceToDelete.name : ''
      }?. Tenga en cuenta que se eliminarán todas las anotaciones relacionadas...`"
      bottomColor="danger"
      :requireReason="true"
      @close="showDeleteServiceModal = false"
      @confirm="handleDeleteService"
    />
  </div>
</template>
