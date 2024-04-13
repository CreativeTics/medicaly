import { getData } from '../../../core/services/get-table/'
import { generateInformedConsent } from '../../../core/services/generate-cert/'

import { PouchService, DB } from '../../../services/pouch'
import { useAuthStore } from '@/store/auth'
import { OrderStatus } from '@/app/core/types/order-status'
import { formatDate } from '@/app/core/util/dates'

const pouch = new PouchService()
const doctype = 'service-orders'

export async function getContractsList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:contracts`,
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
  console.log('getList', searchOptions)

  const where: any = {}

  if (searchOptions.contract) {
    where['contract'] = searchOptions.contract
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
      'medicalExamTypeName',
      'patientName',
      'status',
      'createdAt',
      'updatedAt',
    ],
    where: where,
    sort: [{ createdAt: 'desc' }],
    limit: 50,
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      type: doc.medicalExamTypeName,
      patientName: doc.patientName,
      status: doc.status,
      updatedAt: formatDate(doc.updatedAt, true),
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
  }
}

export async function create(entity: any): Promise<{
  isOk: boolean
  errors?: any[]
}> {
  console.log('create', entity)
  // validate Patients
  const patientErrors = validatePatients(entity.patients)
  if (patientErrors.length > 0) {
    return {
      isOk: false,
      errors: patientErrors,
    }
  }

  // crear service order for each patient

  entity.patients.forEach(async (patient: any) => {
    const patientEntity = {
      doctype: 'patients',
      id: patient.id ?? '',
      documentType: patient.doctype,
      documentNumber: patient.document,
      fullName: `${patient.name.toUpperCase().trim()} ${patient.lastName
        .toUpperCase()
        .trim()}`,
      name: patient.name.toUpperCase().trim().split(' ')[0],
      secondName: patient.name.toUpperCase().trim().split(' ')?.[1] ?? '',
      lastName: patient.lastName.toUpperCase().trim().split(' ')[0],
      secondLastName: patient.lastName.toUpperCase().trim().split(' ')[1] ?? '',
    }

    if (!patient.isOld) {
      const response = await pouch.use(DB.MEDICAL).create(patientEntity)

      console.log('create patient', response)

      patientEntity.id = response?.id ?? ''
    }
    const user = useAuthStore().user

    const contract = await pouch.use(DB.GENERAL).get(entity.contract)
    const medicalExamType = await pouch
      .use(DB.GENERAL)
      .get(entity.medicalExamType)

    const servicesFromAttachOrder = await getServicesFromAttachOrder(
      entity.services
    )

    const serviceOrder = {
      doctype,
      code: 'Por generar',
      status: OrderStatus.pending,
      contract: entity.contract,
      contractName: contract.name,
      services: servicesFromAttachOrder,
      medicalExamType: entity.medicalExamType,
      medicalExamTypeName: medicalExamType.name,
      contractCostCenter: entity.contractCostCenter,
      contractSubsidiary: entity.contractSubsidiary,
      subsidiary: entity.subsidiary,
      position: patient.position,
      observation: patient.observation,
      patientId: patientEntity.id,
      patientName: `${patientEntity.documentNumber} - ${patientEntity.fullName}`,
      patientDocumentNumber: patientEntity.documentNumber,
      patientIsNew: !patient.isOld,
      createdBy: user?.id ?? '',
      orderCycle: [
        {
          type: 'created',
          user: user?.id ?? '',
          status: OrderStatus.pending,
          at: new Date().toISOString(),
        },
      ],
    }
    await pouch.use(DB.GENERAL).create(serviceOrder)
  })

  return {
    isOk: true,
  }
}

async function getServicesFromAttachOrder(services: any[]) {
  const servicesFromAttachOrder = []
  for (const service of services) {
    const serviceFromAttachOrder = await pouch.use(DB.GENERAL).get(service.id)
    servicesFromAttachOrder.push({
      id: serviceFromAttachOrder.id,
      code: serviceFromAttachOrder.code,
      name: serviceFromAttachOrder.name,
      amount: serviceFromAttachOrder.amount,
      exams: serviceFromAttachOrder.exams,
      showForContract: serviceFromAttachOrder.showForContract,
      visibleExams: serviceFromAttachOrder.visibleExams,
      examTypeName: serviceFromAttachOrder.examTypeName,
    })
  }
  return servicesFromAttachOrder
}

function validatePatients(patients: any[]) {
  const errors: any[] = []
  patients.forEach((patient: any, index: number) => {
    if (!patient.doctype) {
      errors.push(
        `El tipo de documento es requerido en el paciente ${index + 1}`
      )
    }
    if (!patient.document) {
      errors.push(`El documento es requerido en el paciente ${index + 1}`)
    }

    if (!patient.name) {
      errors.push(`El nombre es requerido en el paciente ${index + 1}`)
    }

    if (!patient.lastName) {
      errors.push(`El apellido es requerido en el paciente ${index + 1}`)
    }

    if (!patient.position) {
      errors.push(`El cargo es requerido en el paciente ${index + 1}`)
    }
  })

  return errors
}

export async function getInformedConsentUrl(orderId: string): Promise<string> {
  // get order
  const order = await pouch.use(DB.GENERAL).get(orderId)
  let informedConsentId = order.informedConsentFile
  // validate if not has informed consent
  if (!informedConsentId) {
    // generate informed consent
    const informedConsent = await generateInformedConsent(orderId)
    // save new informed consent in order

    const updatedOrder = {
      ...order,
      informedConsentFile: informedConsent.id,
    }
    await pouch.use(DB.GENERAL).update(updatedOrder)
    informedConsentId = informedConsent.id
  }

  // get informed consent Url
  return `/api/files/${informedConsentId}`
}
