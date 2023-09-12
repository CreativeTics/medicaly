import { PouchService, DB } from '../../../services/pouch'
import { getData } from '../../../core/services/get-table/'

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

export async function getLastExam(examCode: string, annotation: any) {
  if (annotation.examId) {
    return await pouch.use(DB.MEDICAL).get(annotation.examId)
  }

  const exams = await getData<any[]>({
    entity: `${DB.MEDICAL}:exams`,
    fields: ['id', 'version'],
    where: {
      code: examCode,
    },
  })

  console.log('getLastExam', examCode, annotation)
  if (!exams.length) {
    return {}
  }

  // get last version
  const lastVersion = exams.reduce((acc: any, curr: any) => {
    if (acc.version < curr.version) {
      return curr.id
    }
    return acc
  })

  return await pouch.use(DB.MEDICAL).get(lastVersion)
}

export async function getPatient(patientDataId: string) {
  const patientData = await pouch.use(DB.MEDICAL).get(patientDataId)
  return patientData
}

export async function getAnnotation(orderId: string, examId: string) {
  const annotations = await getData<any[]>({
    entity: `${DB.GENERAL}:annotations`,
    fields: ['id'],
    where: {
      orderId,
      examId,
    },
  })
  if (!annotations.length) {
    // get from cache
    const cacheAnnotation = localStorage.getItem(
      `annotation:${orderId}${examId}`
    )
    if (cacheAnnotation) {
      return JSON.parse(cacheAnnotation)
    }

    return {}
  }

  return await pouch.use(DB.GENERAL).get(annotations[0].id)
}

export async function cacheAnnotation(
  orderId: string,
  examId: string,
  annotation: any
) {
  localStorage.setItem(
    `annotation:${orderId}${examId}`,
    JSON.stringify(annotation)
  )
}

export async function saveAnnotation(
  orderId: string,
  serviceId: string,
  examVersion: string,
  examId: string,
  annotation: any
) {
  annotation.orderId = orderId
  annotation.serviceId = serviceId
  annotation.examVersion = examVersion
  annotation.examId = examId
  annotation.saveBy = 'patient'
  annotation.saveAt = new Date().toISOString()

  if (!annotation.id) {
    const newAnnotation = await pouch.use(DB.MEDICAL).create({
      doctype: 'annotations',
      ...annotation,
    })

    return newAnnotation
  }
}
