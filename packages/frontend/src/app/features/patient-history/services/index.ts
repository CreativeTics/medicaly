import { formatDate } from '@/app/core/util/dates'
import { getData } from '../../../core/services/get-table/'

import { http } from '@/app/core/services/http'
import { OrderCycleTypes } from '@/app/core/types/order-cycle-types'
import { API_URL } from '@/config'
import { useAuthStore } from '@/store/auth'
import { InformedConsent } from '@features/patient-admission/services'
import { DB, PouchService } from '../../../services/pouch'

const pouch = new PouchService()

export interface PatientSearchResult {
  id: string
  documentType: string
  contractName: string
  documentNumber: string
  fullName: string
  createdAt: string
}

export async function searchPatients(searchOptions: {
  patientDocumentType?: string
  patientDocumentNumber?: string
}): Promise<PatientSearchResult[]> {
  const where = {
    documentType: searchOptions.patientDocumentType,
    documentNumber: searchOptions.patientDocumentNumber,
  }

  const data = await getData<any[]>({
    entity: `${DB.MEDICAL}:patients`,
    fields: [
      'id',
      'documentType',
      'contractName',
      'documentNumber',
      'fullName',
      'createdAt',
    ],
    where: where,
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      documentType: doc.documentType,
      contractName: doc.contractName,
      documentNumber: doc.documentNumber,
      fullName: doc.fullName,
      createdAt: formatDate(doc.createdAt, true),
    }
  })
}

export interface DocumentType {
  id: string
  code: string
  name: string
}

export async function getDocumentTypes(): Promise<DocumentType[]> {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:identification-types`,
    fields: ['id', 'code', 'name'],
    sort: [{ name: 'asc' }],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      name: `${doc.code} - ${doc.name}`,
    }
  })
}

export interface Patient {
  id: string
  name: string
  document: string
  photoId: string
  birthDate: string
  gender: string
}

export async function getPatientById(patientId: string): Promise<Patient> {
  const patient = await pouch.use(DB.MEDICAL).get(patientId)

  const patientsData = await getData<any[]>({
    entity: `${DB.MEDICAL}:patients-data`,
    fields: ['id', 'birthDate', 'photoId'],
    where: { patientId: patientId },
    sort: [{ createdAt: 'desc' }],
  })

  if (patientsData.length > 0) {
    patient.birthDate = patientsData[patientsData.length - 1].birthDate
    patient.photoId = patientsData[patientsData.length - 1].photoId
    patient.gender = patientsData[patientsData.length - 1].gender
  }

  return {
    id: patient.id,
    name: patient.fullName,
    document: patient.documentNumber,
    photoId: patient.photoId,
    birthDate: formatDate(patient.birthDate),
    gender: patient.gender,
  }
}

export interface PatientOrder {
  id: string
  code: string
  medicalExamType: string
  status: string
  createdAt: string
  admissionDate?: string
  endAttentionDate?: string
  informedConsents?: InformedConsent[]
}

export async function getOrdersForPatient(
  patientId: string
): Promise<PatientOrder[]> {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:service-orders`,
    fields: [
      'id',
      'code',
      'medicalExamTypeName',
      'contract',
      'status',
      'createdAt',
      'updatedAt',
      'orderCycle',
      'informedConsents',
    ],
    where: { patientId: patientId },
    sort: [{ createdAt: 'desc' }],
  })
  const user = useAuthStore().user
  const onlyContracts: string[] = []
  if (user?.type == 'contract-user' && user?.relations) {
    onlyContracts.push(...user.relations)
  }

  return data
    .filter(
      (doc: any) =>
        onlyContracts.length == 0 || onlyContracts.includes(doc.contract)
    )
    .map((doc: any) => {
      const dates = getDatesFromOrder(doc)
      return {
        id: doc.id,
        code: doc.code,
        medicalExamType: doc.medicalExamTypeName,
        status: doc.status,
        createdAt: formatDate(doc.createdAt, true),
        admissionDate: dates.dateOfAdmission,
        endAttentionDate: dates.dateOfFinalization,
        informedConsents: doc.informedConsents || [],
      }
    })
}

function getDatesFromOrder(order: any): {
  dateOfAdmission: string
  dateOfFinalization: string
} {
  const dateOfAdmission = order.orderCycle?.find(
    (cycle: any) => cycle.type == OrderCycleTypes.admission
  )?.at
  const dateOfFinalization = order.orderCycle?.find(
    (cycle: any) => cycle.type == OrderCycleTypes.finalized
  )?.at

  return {
    dateOfAdmission: dateOfAdmission ? formatDate(dateOfAdmission, true) : '',
    dateOfFinalization: dateOfFinalization
      ? formatDate(dateOfFinalization, true)
      : '',
  }
}

export function getPrintUrl(orderId: string): string {
  // get informed consent Url
  console.log('token', useAuthStore().token)
  return `${API_URL}/files/api/medical-history/${orderId}?h=${encodeURI(
    useAuthStore().token
  )}`
}

export async function downloadConsent(
  orderId: string,
  consentTemplateCode: string
) {
  try {
    // get templateId
    const consentTemplate = await getData<any[]>({
      entity: `${DB.GENERAL}:templates`,
      fields: ['id'],
      where: { code: consentTemplateCode },
    })

    if (consentTemplate.length === 0) {
      throw 'template not found'
    }

    // get consent print blob
    const consentPrintBlob = await http.get(
      `files/api/consent/${orderId}/${consentTemplate[0].id}`,
      {
        headers: {
          Authorization: `${useAuthStore().token}`,
        },
        responseType: 'blob',
      }
    )

    if (consentPrintBlob.status !== 200) {
      throw 'Error al descargar el archivo'
    }

    // generate download file url
    return URL.createObjectURL(consentPrintBlob.data)
  } catch (error) {
    console.error(error)
  }
}
