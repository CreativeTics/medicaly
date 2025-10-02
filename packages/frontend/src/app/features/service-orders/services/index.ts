import { getData } from '../../../core/services/get-table/'

import { http } from '@/app/core/services/http'
import { OrderStatus } from '@/app/core/types/order-status'
import { formatDate } from '@/app/core/util/dates'
import { API_URL } from '@/config'
import { useAuthStore } from '@/store/auth'
import { DB, PouchService } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'service-orders'

export interface ContractSelectResult {
  id: string
  name: string
}

export async function getContracts(): Promise<ContractSelectResult[]> {
  const user = useAuthStore().user
  const where: any = {
    status: 'active',
  }
  if (user && user?.type != 'employee' && !user.relations.length) {
    return []
  }
  if (user && user?.type != 'employee' && user.relations.length > 0) {
    where['_id'] = {
      $in: user.relations,
    }
  }

  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:contracts`,
    fields: ['id', 'name'],
    where,
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

  const user = useAuthStore().user
  if (user && user?.type != 'employee' && user.relations.length > 0) {
    // validate if has active contracts
    if ((await getContracts()).length === 0) {
      return []
    }

    // get all subsidiaries for the user
    const data = await getData<any[]>({
      entity: `${DB.GENERAL}:contract-users`,
      fields: ['id', 'subsidiaries'],
      where: {
        user: user.id,
        contractId: { $in: user.relations },
      },
    })
    const subsidiaries = data.map((_) => _.subsidiaries).flat()

    if (data.length > 0) {
      console.log('subsidiaries', subsidiaries)
      where['contractSubsidiary'] = {
        $in: subsidiaries,
      }
    }

    where['contract'] = {
      $in: user.relations,
    }
  }

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

  const servicesMapped = await Promise.all(
    order.services.map(async (service: any) => {
      return {
        ...service,
        visibleExams: await getExamsForService(service.visibleExams),
      }
    })
  )

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
    services: servicesMapped,
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
    const servicesFromAttachOrder = await getServicesFromAttachOrder(
      entity.services
    )

    if (servicesFromAttachOrder.length === 0) {
      return {
        isOk: false,
        errors: ['No se encontraron servicios en la orden'],
      }
    }

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

    const serviceOrder = {
      doctype,
      code: 'Por generar',
      status: OrderStatus.pending,
      contract: entity.contract,
      contractName: contract.name,
      services: servicesFromAttachOrder,
      medicalExamType: entity.medicalExamType,
      medicalExamTypeName: `${medicalExamType.name}:${medicalExamType.emphasis}`,
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
    const usedExams = [
      ...serviceFromAttachOrder.exams,
      ...serviceFromAttachOrder.visibleExams,
    ]
    const allExams = await getData<
      {
        id: string
        code: string
      }[]
    >({
      entity: `${DB.MEDICAL}:exams`,
      fields: ['id', 'code'],
      where: {
        code: {
          $in: usedExams,
        },
        isLastVersion: true,
      },
    })

    servicesFromAttachOrder.push({
      id: serviceFromAttachOrder.id,
      code: serviceFromAttachOrder.code,
      name: serviceFromAttachOrder.name,
      amount: serviceFromAttachOrder.amount,
      exams: serviceFromAttachOrder.exams.map((examCode: string) => {
        const exam = allExams.find((exam) => exam.code === examCode)
        if (!exam) {
          throw new Error('Examen no encontrado')
        }
        return exam.id
      }),
      showForContract: serviceFromAttachOrder.showForContract,
      visibleExams: serviceFromAttachOrder.visibleExams.map(
        (examCode: string) => {
          const exam = allExams.find((exam) => exam.code === examCode)
          if (!exam) {
            throw new Error('Examen no encontrado')
          }
          return exam.id
        }
      ),
      examTypeName: serviceFromAttachOrder.examTypeName,
      status: OrderStatus.pending,
    })
  }
  return servicesFromAttachOrder
}

function validatePatients(patients: any[]) {
  const errors: any[] = []

  if (!patients || patients.length === 0) {
    errors.push('Debe agregar al menos un paciente!')
    return errors
  }

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

export async function downloadExamCertificate(
  orderId: string,
  serviceId: string,
  examId: string
) {
  try {
    // get exam print blob
    const examPrintBuffer = await http.post(
      'files/api/certificates/',
      {
        order: orderId,
        serviceId,
        examId,
      },
      {
        headers: {
          Authorization: `${useAuthStore().token}`,
        },
        responseType: 'arraybuffer',
      }
    )

    if (examPrintBuffer.status !== 200) {
      throw 'Error al descargar el archivo'
    }

    const blob = new Blob([examPrintBuffer.data], { type: `application/json` })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificado-${orderId}-${serviceId}-${examId}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}

export async function getAnnotationUrl(
  orderId: string,
  serviceId: string,
  examId: string
): Promise<string> {
  // get annotation id from order
  const order = await pouch.use(DB.GENERAL).get(orderId)
  let annotationId = ''
  order.services.forEach((service: any) => {
    service.annotations.forEach((annotation: string) => {
      if (annotation.includes(`:${serviceId}:${examId}`)) {
        annotationId = annotation
      }
    })
  })

  // get annotation Url
  console.log('token', useAuthStore().token)
  return `${API_URL}/files/api/annotations/${orderId}/${annotationId}?h=${encodeURI(
    useAuthStore().token
  )}`
}

async function getExamsForService(examsId: string[]): Promise<any> {
  const exams = await Promise.all(
    examsId.map(async (examId) => {
      return await getExam(examId)
    })
  )

  return exams
}

async function getExam(examId: string): Promise<{
  id: string
  code: string
  name: string
  requireCertificate: boolean
}> {
  const examRaw = await pouch.use(DB.MEDICAL).get(examId)

  return {
    id: examRaw.id,
    code: examRaw.code,
    name: examRaw.name,
    requireCertificate: examRaw.requireCertificate,
  }
}
