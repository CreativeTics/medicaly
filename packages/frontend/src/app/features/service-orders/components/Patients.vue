<script lang="ts" setup>
import { DBtn, DSelectFieldSearch, DTextField } from '@components/basic'
import { Trash03Icon } from '@components/basic/icons'

import Popper from 'vue3-popper'

import {
  getDocumentTypes,
  searchPatient,
  getContractPositions,
} from '../services/patients'
import { onMounted, ref, watch } from 'vue'
interface Patient {
  id?: string
  doctype: string
  document: string
  name: string
  lastName: string
  position: string
  observation: string
  isOld?: boolean
}

const props = defineProps<{
  allModel: any
  modelValue: any[]
  error?: string
}>()

const emit = defineEmits(['update:modelValue'])

const patients = ref<Patient[]>([])
const documentTypes = ref<any[]>([])
const positions = ref<any[]>([])
const errors = ref<any>({})

watch(
  () => props.allModel?.contract,
  async (value) => {
    if (value) {
      positions.value = await getContractPositions(value)
    }
  }
)

watch(
  () => patients.value,
  async (value) => {
    emit('update:modelValue', value)
  }
)

const addRow = () => {
  patients.value.push({
    doctype: '',
    document: '',
    name: '',
    lastName: '',
    position: '',
    observation: '',
    isOld: false,
  })
}

const removeRow = (index: number) => {
  patients.value.splice(index, 1)
}

const searchPatientByDocument = async (patient: Patient, index: number) => {
  if (patient.doctype !== '' && patient.document !== '') {
    const patientOld = await searchPatient(patient.doctype, patient.document)
    if (patientOld.length > 0) {
      patients.value[index].id = patientOld[0].id
      patients.value[index].name = patientOld[0].name
      patients.value[index].lastName = patientOld[0].lastName
      patients.value[index].isOld = true
    }
  }
}

onMounted(async () => {
  patients.value = []
  documentTypes.value = await getDocumentTypes()
  positions.value = await getContractPositions(props.allModel?.contract)
})
</script>
<template>
  <div class="w-full">
    <table class="table-auto w-full">
      <thead>
        <tr class="bg-gray-50">
          <th>#</th>
          <th>Tipo doc.</th>
          <th># doc.</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Cargo</th>
          <th>Observación</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(patient, i) in patients" :key="i" class="hover:bg-gray-50">
          <td class="w-2">{{ i + 1 }}</td>
          <td class="w-48">
            <DSelectFieldSearch
              label=""
              id="doctype"
              v-model="patient.doctype"
              :options="documentTypes"
              class="w-full"
              :error="errors[i]?.doctype"
              :disabled="patient.isOld"
              @change="searchPatientByDocument(patient, i)"
            />
          </td>
          <td class="w-48">
            <DTextField
              id="document"
              label=""
              v-model="patient.document"
              class="w-full"
              :error="errors[i]?.document"
              placeholder="Ingrese el número de documento"
              :disabled="patient.isOld"
              @change="searchPatientByDocument(patient, i)"
            />
          </td>
          <td class="w-48">
            <DTextField
              id="name"
              label=""
              v-model="patient.name"
              class="w-full"
              :error="errors[i]?.name"
              placeholder="Ingrese el nombre del paciente"
              :disabled="patient.isOld"
              @keyup.prevent=""
            />
          </td>
          <td class="w-48">
            <DTextField
              id="lastName"
              label=""
              v-model="patient.lastName"
              class="w-full"
              :error="errors[i]?.lastName"
              :disabled="patient.isOld"
              placeholder="Ingrese los apellidos del paciente"
            />
          </td>
          <td class="w-48">
            <DSelectFieldSearch
              label=""
              id="position"
              v-model="patient.position"
              :options="positions"
              class="w-full"
              :error="errors[i]?.position"
            />
          </td>
          <td>
            <DTextField
              id="observation"
              label=""
              v-model="patient.observation"
              class="w-full"
              placeholder="Ingrese una observación"
            />
          </td>
          <td>
            <div class="flex w-full justify-end">
              <Popper
                arrow
                offsetDistance="12"
                content="Remover"
                :hover="true"
                placement="left"
                class="tooltip"
              >
                <div
                  class="bg-gray-50 rounded-md py-2 mt-1"
                  @click="removeRow(i)"
                >
                  <Trash03Icon
                    class="h-6 w-6 mx-2 cursor-pointer text-gray-600"
                  />
                </div>
              </Popper>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="8">
            <div class="flex w-full justify-end">
              <Popper
                arrow
                offsetDistance="12"
                content="Agregar paciente"
                :hover="true"
                placement="left"
                class="tooltip"
              >
                <DBtn class="bg-indigo-500 rounded-md mt-2" @click="addRow">
                  Agregar Paciente
                </DBtn>
              </Popper>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
    <span class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
