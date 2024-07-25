<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useImageFile } from '@/app/core/composable/useImageFile'

import { getExamUrl, getInformedConsentUrl, getOrder } from '../services'
import OrderStatus from '../components/OrderStatus.vue'
import DBtn from '@components/basic/DBtn.vue'
import DLoadingIcon from '@components/basic/icons/Loading01Icon.vue'
import ExamIcon from '@components/basic/icons/FileAttachment01Icon.vue'
import { getPatient } from '../services/patients'
import { useNotificationsStore } from '@/store/notifications'

const notifications = useNotificationsStore()
const route = useRoute()
const router = useRouter()
const photo = useImageFile()

const order = ref<any>({})
const loading = ref(false)
const consentIsLoading = ref(false)

const back = () => {
  console.log('Back')
  router.back()
}

const downloadConsent = async (id: string) => {
  consentIsLoading.value = true
  console.log('Download consent', id)
  const url = await getInformedConsentUrl(id)
  window.open(url, '_blank')
  consentIsLoading.value = false
}

const downloadExam = async (serviceId: string, examId: string) => {
  try {
    const url = await getExamUrl(order.value.id, serviceId, examId)
    //nueva ventana
    window.open(url, '_blank')
  } catch (error: Error) {
    notifications.addNotification({
      type: 'error',
      title: 'No se puede mostrar el examen',
      text: error.message,
    })
  }
}

onMounted(async () => {
  if (route.params.id) {
    loading.value = true
    order.value = await getOrder(route.params.id.toString())
    const patientData = await getPatient(order.value.patientDataId)
    photo.loadImageFromId(patientData.photoId)
    loading.value = false
  }
})
</script>

<template>
  <div class="h-full px-5">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p
          class="text-3xl flex items-center gap-5 font-semibold text-shadow text-blue-900"
        >
          Orden # {{ order.code }}
          <OrderStatus :status="order.status" class="text-lg" />

          {{}}
        </p>
      </div>
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
              class="rounded-full object-cover h-full w-full"
              :src="photo.imageBase64.value"
              alt="Foto del paciente"
            />
          </div>
          <div class="flex flex-col">
            <span class="font-semibold">Nombre </span>
            <span class="font-semibold">Documento</span>
            <span class="font-semibold"
              >Consentimiento {{ order?.informedConsent }}</span
            >
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-semibold">
              {{ order?.patientName }}
            </span>
            <span class="text-sm">{{ order.patientDocumentNumber }}</span>
            <span class="text-sm">
              <span
                v-if="order?.informedConsent"
                href=""
                class="text-blue-800 flex gap-2 cursor-pointer"
                @click="downloadConsent(order?.id)"
                >Consentimiento informado
                <DLoadingIcon v-show="consentIsLoading" class="animate-spin"
              /></span>
            </span>
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
                <span class="text-sm">
                  <ul v-if="service.showForContract">
                    <li v-for="exam in service.visibleExams">
                      <span
                        href=""
                        class="text-blue-800 flex gap-2 cursor-pointer hover:resize"
                        @click="downloadExam(service.id, exam?.id)"
                      >
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
  </div>
</template>
