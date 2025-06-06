import { calculateAgeFromBirthDate, formatDate } from '@/app/core/util/dates'
import { getData } from '../../../core/services/get-table/'

import { DB, PouchService } from '../../../services/pouch'
// import { useAuthStore } from "@/store/auth";
import { OrderStatus } from '@/app/core/types/order-status'
import { useAuthStore } from '@/store/auth'

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
    // save in local storage
    localStorage.setItem('user-subsidiary', searchOptions.subsidiary)
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
      'observation',
      'createdAt',
    ],
    where: where,
    sort: [{ createdAt: 'desc' }],
    limit: 50,
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      contractName: doc.contractName,
      type: doc.medicalExamTypeName,
      patientName: doc.patientName,
      status: doc.status,
      observation: doc.observation,
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
  } else {
    // get last patient data

    const patientData = await getData<any[]>(
      {
        entity: `${DB.MEDICAL}:patients-data`,
        fields: ['id', 'patientId', 'createdAt'],
        where: {
          patientId: order.patientId,
        },
        sort: [{ createdAt: 'desc' }],
      },
      {
        name: 'sort-by-created-at',
        fields: ['createdAt'],
      }
    )

    if (patientData.length) {
      const lastPatientData = await pouch.use(DB.MEDICAL).get(patientData[0].id)
      delete lastPatientData.id
      delete lastPatientData.signatureId
      delete lastPatientData.fingerprintId
      delete lastPatientData.photoId
      patient = {
        ...patient,
        ...lastPatientData,
      }
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

export interface InformedConsent {
  code: string
  name: string
  accepted: boolean
}

export async function getInformedConsentsForOrder(
  orderId: string
): Promise<InformedConsent[]> {
  const order = await pouch.use(DB.GENERAL).get(orderId)

  const informedConsents = new Map<string, InformedConsent>()

  informedConsents.set('INFORMED-CONSENT', {
    code: 'INFORMED-CONSENT',
    name: 'Consentimiento Informado General',
    accepted: false,
  })

  await Promise.all(
    order.services.map(async (service: any) => {
      await Promise.all(
        service.exams.map(async (examId: any) => {
          const exam = await pouch.use(DB.MEDICAL).get(examId)
          if (exam.requireConsent) {
            const consent = await pouch
              .use(DB.GENERAL)
              .get(exam.consentTemplate)

            informedConsents.set(consent.code, {
              code: consent.code,
              name: consent.name,
              accepted: false,
            })
          }
        })
      )
    })
  )

  return Array.from(informedConsents.values())
}

export async function admitPatientOrder(
  orderId: string,
  patient: any,
  informedConsents: InformedConsent[]
): Promise<{
  success: boolean
  errorMessage?: string
}> {
  // validate patient images

  if (!patient.photoId) {
    return {
      success: false,
      errorMessage: 'La foto del paciente es requerida!',
    }
  }

  if (!patient.signatureId) {
    return {
      success: false,
      errorMessage: 'La firma del paciente es requerida!',
    }
  }

  if (!patient.fingerprintId) {
    return {
      success: false,
      errorMessage: 'La huella del paciente es requerida!',
    }
  }
  // validate consents accepted

  if (informedConsents.filter((consent) => !consent.accepted).length > 0) {
    return {
      success: false,
      errorMessage: 'Todos los consentimientos deben ser aceptados!',
    }
  }

  const oldOrder = await pouch.use(DB.GENERAL).get(orderId)

  const patientUpdate = await savePatientData({
    ...patient,
    id: oldOrder.patientId,
    patientDataId: oldOrder.patientDataId,
  })

  const orderCycle: any[] = oldOrder.orderCycle ?? []
  const user = useAuthStore().user
  if (!user?.relations?.[0]) {
    return {
      success: false,
      errorMessage: 'Usuario Invalido!',
    }
  }

  const employee = await getEmployee(user?.relations[0])

  orderCycle.push({
    type: 'admission',
    user: user?.id,
    employee,
    status: OrderStatus.inprogress,
    at: new Date().toISOString(),
  })

  const orderUpdated = {
    ...oldOrder,
    status: OrderStatus.inprogress,
    patientId: patientUpdate.id,
    patientDataId: patientUpdate.dataId,
    patientName: `${patient.documentNumber} - ${patient.name} ${patient.secondName} ${patient.lastName} ${patient.secondLastName}`,
    orderCycle,
    admittedBy: oldOrder.employee ?? employee,
    informedConsents, // save informed consents
  }

  await pouch.use(DB.GENERAL).update(orderUpdated)

  return {
    success: true,
  }
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
    age: calculateAgeFromBirthDate(patient.birthDate),
    maritalStatus: patient.maritalStatus,
    bloodType: patient.bloodType,
    dominantHand: patient.dominantHand,
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
    photoId: patient.photoId,
    signatureId: patient.signatureId,
    fingerprintId: patient.fingerprintId,
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
    dataId: response?.id ?? '',
  }
}

interface PatientData {
  doctype: string
  id: string
  patientId: string
  birthDate?: string
  age: {
    years: number
    months: number
    days: number
  }
  maritalStatus?: string
  bloodType?: string
  dominantHand?: string
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
  photoId?: string
  signatureId?: string
  fingerprintId?: string
}

async function getEmployee(id: string) {
  const employee = await pouch.use(DB.GENERAL).get(id)

  return {
    id: employee.id,
    name: employee.fullName,
    position: employee.positionName,
    document: employee.documentNumber,
  }
}
