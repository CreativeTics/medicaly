import { PouchService, DB } from '../../../services/pouch'
import { getData } from '../../../core/services/get-table/'
import { OrderStatus } from '@/app/core/types/order-status'

const pouch = new PouchService()

export async function getService(id: string) {
  const service = await pouch.use(DB.GENERAL).get(id)
  let exams = []

  if (service.exams) {
    exams = await Promise.all(
      service.exams.map(async (exam: string) => {
        const examDoc = await pouch.use(DB.MEDICAL).get(exam)

        return {
          id: examDoc.id,
          code: examDoc.code,
          name: examDoc.name,
          type: examDoc.type,
          version: examDoc.version,
          form: examDoc.form,
        }
      })
    )
  }

  return {
    code: service.code,
    name: service.name,
    description: service.description,
    exams,
  }
}

export async function getLastExamOrAnnotationExam(
  examCode: string,
  annotation: any
) {
  let exam: any = {}

  if (annotation.examId) {
    exam = await pouch.use(DB.MEDICAL).get(annotation.examId)
  } else {
    const exams = await getData<any[]>({
      entity: `${DB.MEDICAL}:exams`,
      fields: ['id', 'version'],
      where: {
        code: examCode,
      },
    })

    if (!exams.length) {
      return exam
    }

    // get last version
    const lastVersion = exams.reduce((acc: any, curr: any) => {
      if (acc.version < curr.version) {
        return curr
      }
      return acc
    })

    exam = await pouch.use(DB.MEDICAL).get(lastVersion.id)
  }

  try {
    exam.form = JSON.parse(exam.form) || {}
    exam.formIsValid = true
  } catch (error) {
    exam.form = {}
    exam.formIsValid = false
    console.error('getLastExam', error)
  }

  return exam
}

export async function getPatient(patientDataId: string) {
  const patientData = await pouch.use(DB.MEDICAL).get(patientDataId)
  return patientData
}

export async function getAnnotation(
  orderId: string,
  serviceId: string,
  examCode: string
) {
  const annotations = await getData<any[]>({
    entity: `${DB.MEDICAL}:annotations`,
    fields: ['id'],
    where: {
      orderId,
      examCode,
    },
  })
  console.log('annotations', annotations)
  if (!annotations.length) {
    // get from cache
    const cacheAnnotation = localStorage.getItem(
      `annotation:${orderId}${serviceId}${examCode}`
    )
    if (cacheAnnotation) {
      return JSON.parse(cacheAnnotation)
    }

    return {}
  }
  return await pouch.use(DB.MEDICAL).get(annotations[0].id)
}

export async function cacheAnnotation(
  orderId: string,
  serviceId: string,
  examCode: string,
  annotation: any
) {
  localStorage.setItem(
    `annotation:${orderId}${serviceId}${examCode}`,
    JSON.stringify(annotation)
  )
}

export async function saveAnnotation(
  orderId: string,
  serviceId: string,
  examId: string,
  examCode: string,
  examVersion: string,
  annotation: any
) {
  annotation.saveBy = 'patient'
  annotation.saveAt = new Date().toISOString()

  if (!annotation.id) {
    annotation.orderId = orderId
    annotation.serviceId = serviceId
    annotation.examId = examId
    annotation.examCode = examCode
    annotation.examVersion = examVersion

    const newAnnotation = await pouch.use(DB.MEDICAL).create({
      doctype: 'annotations',
      _id: `${new Date().getFullYear()}:${orderId}:${serviceId}:${examId}`,
      ...annotation,
    })
    console.log('newAnnotation', newAnnotation)
    if (newAnnotation) {
      // update order
      await updateOrder(orderId, serviceId, newAnnotation.id)
    }
    //  clear cache
    localStorage.removeItem(`annotation:${orderId}${serviceId}${examCode}`)

    return newAnnotation
  }

  const updatedAnnotation = await pouch.use(DB.MEDICAL).update({
    doctype: 'annotations',
    ...annotation,
  })
  return updatedAnnotation
}

async function updateOrder(
  orderId: string,
  serviceId: string,
  annotationId: string
) {
  const oldOrder = await pouch.use(DB.GENERAL).get(orderId)

  const service = oldOrder.services.find(
    (service: any) => service.id === serviceId
  )

  if (service) {
    service.annotations = service.annotations || []
    service.annotations.push(annotationId)
    // validate if annotations is complete
    const serviceAll = await getService(serviceId)
    if (service.annotations.length === serviceAll.exams.length) {
      service.status = OrderStatus.completed
    }
  }

  const orderCycle: any[] = oldOrder.orderCycle || []
  orderCycle.push({
    type: 'attention',
    user: 'user',
    status: OrderStatus.inprogress,
    at: new Date().toISOString(),
  })

  const orderUpdated = {
    ...oldOrder,
    orderCycle,
  }

  await pouch.use(DB.GENERAL).update(orderUpdated)
}

export async function finalizeOrder(orderId: string): Promise<boolean> {
  const oldOrder = await pouch.use(DB.GENERAL).get(orderId)
  // validate if order is in progress
  if (oldOrder.status !== OrderStatus.inprogress) {
    throw new Error('Order is not in progress')
  }

  // validate if order is complete
  const services = oldOrder.services || []
  const servicesComplete = services.filter(
    (service: any) => service.status === OrderStatus.completed
  )
  if (servicesComplete.length !== services.length) {
    throw new Error('Order is not complete')
  }
  // TODO: validate if medic is same of initial annotation

  // update order status

  const orderCycle: any[] = oldOrder.orderCycle || []
  orderCycle.push({
    type: 'finalize',
    user: 'user', // TODO: get user
    status: OrderStatus.completed,
    at: new Date().toISOString(),
  })

  const orderUpdated = {
    ...oldOrder,
    orderCycle,
    status: OrderStatus.completed,
  }

  await pouch.use(DB.GENERAL).update(orderUpdated)

  return true
}
