import { getData } from '../../../core/services/get-table/'
import { formatDate } from '@/app/core/util/dates'

import { PouchService, DB } from '../../../services/pouch'
import { http } from '@/app/core/services/http'
import { useAuthStore } from '@/store/auth'
import { API_URL } from '@/config'

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
  patientName?: string
}): Promise<PatientSearchResult[]> {
  const where: any = {}

  if (searchOptions.patientDocumentType)
    where['documentType'] = searchOptions.patientDocumentType

  if (searchOptions.patientDocumentNumber)
    where['documentNumber'] = {
      $regex: `(?i).*${searchOptions.patientDocumentNumber}.*`,
    }

  if (searchOptions.patientName)
    where['fullName'] = { $regex: `(?i).*${searchOptions.patientName}.*` }

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
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      name: doc.name,
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
    birthDate: formatDate(patient.birthDate, true),
    gender: patient.gender,
  }
}

export interface PatientOrder {
  id: string
  code: string
  medicalExamType: string
  status: string
  createdAt: string
  updatedAt: string
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
      'status',
      'createdAt',
      'updatedAt',
      'orderCycle',
    ],
    where: { patientId: patientId },
  })

  return data.reverse().map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      medicalExamType: doc.medicalExamTypeName,
      status: doc.status,
      createdAt: formatDate(doc.createdAt, true),
      updatedAt: formatDate(doc.updatedAt, true),
    }
  })
}

export async function getPrintUrl(
  code: string,
  orderId: string
): Promise<string> {
  const certificate = await http.post(
    'files/api/certificates/',
    {
      order: orderId,
      code,
    },
    {
      headers: {
        Authorization: `${useAuthStore().token}`,
      },
    }
  )

  // get informed consent Url
  return `${API_URL}/files/api/files/${certificate.data?.id}?h=${encodeURI(
    useAuthStore().token
  )}`
}
