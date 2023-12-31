import { getData } from '../../../core/services/get-table/'
import { formatDate } from '@/app/core/util/dates'

import { PouchService, DB } from '../../../services/pouch'
// import { useAuthStore } from "@/store/auth";
import { OrderStatus } from '@/app/core/types/order-status'

const pouch = new PouchService()
const doctype = 'service-orders'

export async function getSubsidiariesList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:subsidiaries`,
    fields: ['id', 'name'],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
    }
  })
}

export async function getList(searchOptions: any) {
  const where: any = {
    $or: [
      {
        status: OrderStatus.pending,
      },
      {
        status: OrderStatus.inprogress,
      },
    ],
  }

  if (searchOptions.subsidiary) {
    where['subsidiary'] = searchOptions.subsidiary
  }

  if (searchOptions.orderCode) {
    where['code'] = { $regex: `(?i).*${searchOptions.orderCode}.*` }
  }

  if (searchOptions.patient) {
    where['patientName'] = { $regex: `(?i).*${searchOptions.patient}.*` }
  }

  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: [
      'id',
      'code',
      'contractName',
      'medicalExamTypeName',
      'patientName',
      'status',
      'createdAt',
    ],
    where: where,
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      contractName: doc.contractName,
      type: doc.medicalExamTypeName,
      patientName: doc.patientName,
      status: doc.status,
      createdAt: formatDate(doc.createdAt, true),
    }
  })
}

export async function getOrder(id: string) {
  const order = await pouch.use(DB.GENERAL).get(id)

  // get contractSubsidiary
  const contractSubsidiary = await pouch
    .use(DB.GENERAL)
    .get(order.contractSubsidiary)
  // get contractCostCenter
  const contractCostCenter = await pouch
    .use(DB.GENERAL)
    .get(order.contractCostCenter)
  // get medicalExamType
  const medicalExamType = await pouch.use(DB.GENERAL).get(order.medicalExamType)

  // get patient
  let patient = await pouch.use(DB.MEDICAL).get(order.patientId)

  if (order.patientDataId) {
    const patientData = await pouch.use(DB.MEDICAL).get(order.patientDataId)
    patient = {
      ...patient,
      ...patientData,
    }
  }

  return {
    ...order,
    contractSubsidiary: {
      id: contractSubsidiary.id,
      name: contractSubsidiary.name,
    },
    contractCostCenter: {
      id: contractCostCenter.id,
      name: contractCostCenter.name,
    },
    medicalExamType: {
      id: medicalExamType.id,
      name: medicalExamType.name,
      emphasis: medicalExamType.emphasis,
    },
    patient,
  }
}

export async function admitPatientOrder(orderId: string, patient: any) {
  // TODO: save patient images

  const oldOrder = await pouch.use(DB.GENERAL).get(orderId)

  const patientUpdate = await savePatientData({
    ...patient,
    id: oldOrder.patientId,
    patientDataId: oldOrder.patientDataId,
  })

  const orderCycle: any[] = oldOrder.orderCycle || []
  orderCycle.push({
    type: 'admission',
    user: 'user',
    status: OrderStatus.inprogress,
    at: new Date().toISOString(),
  })

  const orderUpdated = {
    ...oldOrder,
    status: OrderStatus.inprogress,
    patientId: patientUpdate.id,
    patientDataId: patientUpdate.dataId,
    orderCycle,
  }

  await pouch.use(DB.GENERAL).update(orderUpdated)
}

export async function savePatientData(patient: any): Promise<{
  id: string
  dataId: string
}> {
  console.log('patient', patient)
  //patient names
  const oldPatient = await pouch.use(DB.MEDICAL).get(patient.id)

  await pouch.use(DB.MEDICAL).update({
    ...oldPatient,
    id: patient.id,
    name: patient.name,
    secondName: patient.secondName,
    lastName: patient.lastName,
    secondLastName: patient.secondLastName,
    fullName: `${patient.name} ${patient.secondName} ${patient.lastName} ${patient.secondLastName}`,
  })

  //patient data
  let oldPatientData = {}

  if (patient.patientDataId) {
    oldPatientData = await pouch.use(DB.MEDICAL).get(patient.patientDataId)
  }

  const patientData: PatientData = {
    doctype: 'patients-data',
    id: patient.patientDataId,
    patientId: patient.id,
    birthDate: patient.birthDate,
    maritalStatus: patient.maritalStatus,
    bloodType: patient.bloodType,
    eps: patient.eps,
    epsAffiliationType: patient.epsAffiliationType,
    arl: patient.arl,
    schoolLevel: patient.schoolLevel,
    biologicalSex: patient.biologicalSex,
    gender: patient.gender,
    applyPosition: patient.applyPosition,
    precedenceCity: patient.precedenceCity,
    residenceCity: patient.residenceCity,
    residenceType: patient.residenceType,
    residenceAddress: patient.residenceAddress,
    residencePhone: patient.residencePhone,
    accompanyingName: patient.accompanyingName,
    accompanyingParent: patient.accompanyingParent,
    accompanyingAddress: patient.accompanyingAddress,
    accompanyingPhone: patient.accompanyingPhone,
    responsibleName: patient.responsibleName,
    responsibleParent: patient.responsibleParent,
    responsibleAddress: patient.responsibleAddress,
    responsiblePhone: patient.responsiblePhone,
    observation: patient.observation,
  }

  if (patient.patientDataId) {
    await pouch.use(DB.MEDICAL).update({
      ...oldPatientData,
      ...patientData,
    })
    return {
      id: patient.id,
      dataId: patient.patientDataId,
    }
  }

  const response = await pouch.use(DB.MEDICAL).create(patientData)
  return {
    id: patient.id,
    dataId: response?.id || '',
  }
}

interface PatientData {
  doctype: string
  id: string
  patientId: string
  birthDate?: string
  maritalStatus?: string
  bloodType?: string
  eps?: string
  epsAffiliationType?: string
  arl?: string
  schoolLevel?: string
  biologicalSex?: string
  gender?: string
  applyPosition?: string
  precedenceCity?: string
  residenceCity?: string
  residenceType?: string
  residenceAddress?: string
  residencePhone?: string
  accompanyingName?: string
  accompanyingParent?: string
  accompanyingAddress?: string
  accompanyingPhone?: string
  responsibleName?: string
  responsibleParent?: string
  responsibleAddress?: string
  responsiblePhone?: string
  observation?: string
}
