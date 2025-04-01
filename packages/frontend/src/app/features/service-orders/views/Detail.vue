<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useImageFile } from '@/app/core/composable/useImageFile'

import {
  downloadExamCertificate,
  getOrder,
  getAnnotationUrl,
} from '../services'
import OrderStatus from '../components/OrderStatus.vue'
import { getPatient } from '../services/patients'
import { OrderStatus as OrderStatusEnum } from '@/app/core/types/order-status'
import { useNotificationsStore } from '@/store/notifications'

import { DBtn } from '@components/basic'
import {
  FileAttachment01Icon as ExamIcon,
  Loading01Icon,
  XIcon,
  ArrowRightIcon,
} from '@components/basic/icons'
import OrderCycle from '../components/OrderCycle.vue'
import { useAuthStore } from '@/store/auth'

const notifications = useNotificationsStore()
const route = useRoute()
const router = useRouter()
const photo = useImageFile()

const order = ref<any>({})
const loading = ref(false)

// modal
const modalActive = ref(false)
const selectedAnnotationUrl = ref('')
const handleShowAnnotation = async (serviceId: string, exam: any) => {
  selectedAnnotationUrl.value = await getAnnotationUrl(
    order.value.id,
    serviceId,
    exam.id
  )
  modalActive.value = true
}
const closeModal = () => {
  modalActive.value = false
  selectedAnnotationUrl.value = ''
}
const handleDownloadExamCertificate = async (
  serviceId: string,
  exam: {
    id: string
    loading: boolean
  }
) => {
  exam.loading = true
  try {
    const examId = exam.id
    // Descargar el examen
    await downloadExamCertificate(order.value.id, serviceId, examId)
  } catch (error: any) {
    notifications.addNotification({
      type: 'error',
      title: 'No se puede descargar el examen',
      text: error.message,
    })
  }
  exam.loading = false
}

const back = () => {
  router.back()
}

onMounted(async () => {
  if (route.params.id) {
    loading.value = true
    order.value = await getOrder(route.params.id.toString())
    const patientData = await getPatient(order.value.patientDataId)
    photo.loadImageFromId(patientData.photoId)
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
        </p>
      </div>
      <OrderCycle
        v-if="
          useAuthStore().user?.role?.permissions?.includes(
            'service-orders:full'
          )
        "
        :orderCycle="order.orderCycle"
      />
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
          <div class="rounded-full h-24 w-24 bg-white">
            <img
              v-if="photo.imageBase64.value"
              class="rounded-full object-cover h-full w-full"
              :src="photo.imageBase64.value"
              alt="Foto del paciente"
            />
          </div>
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
              <th class="text-left"></th>
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
              <td>
                <span
                  class="text-sm"
                  v-if="order.status == OrderStatusEnum.completed"
                >
                  <ul v-if="service.showForContract">
                    <li v-for="exam in service.visibleExams">
                      <span
                        v-if="exam.requireCertificate"
                        href=""
                        class="text-blue-800 flex gap-2 cursor-pointer hover:resize"
                        @click="handleDownloadExamCertificate(service.id, exam)"
                      >
                        <ArrowRightIcon class="h-4 w-4 mx-2" />
                        {{ exam.code }} - {{ exam.name }}

                        <Loading01Icon
                          v-if="exam.loading"
                          class="animate-spin"
                        />
                      </span>
                      <span
                        v-else
                        class="text-blue-800 flex gap-2 cursor-pointer hover:resize"
                        @click="handleShowAnnotation(service.id, exam)"
                      >
                        <ArrowRightIcon class="h-4 w-4 mx-2" />
                        {{ exam.code }} - {{ exam.name }}
                      </span>
                    </li>
                  </ul>
                </span>
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
      <div class="relative w-full h-full bg-white rounded-2xl p-5">
        <div
          class="absolute -right-5 -top-5 cursor-pointer rounded-full bg-gray-50 text-gray-500 p-3"
          @click="closeModal"
        >
          <XIcon class="w-6 h-6 cursor-pointer" />
        </div>
        <div class="w-full h-full">
          <iframe
            :src="selectedAnnotationUrl"
            frameborder="0"
            class="w-full h-full"
            style="height: 80vh"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
