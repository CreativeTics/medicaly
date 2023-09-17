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

export async function getLastExamOrAnnotationExam(
  examCode: string,
  annotation: any
) {
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

  if (!exams.length) {
    return {}
  }

  // get last version
  const lastVersion = exams.reduce((acc: any, curr: any) => {
    if (acc.version < curr.version) {
      return curr
    }
    return acc
  })

  const exam = await pouch.use(DB.MEDICAL).get(lastVersion.id)

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

export async function getAnnotation(orderId: string, examCode: string) {
  const annotations = await getData<any[]>({
    entity: `${DB.GENERAL}:annotations`,
    fields: ['id'],
    where: {
      orderId,
      examCode,
    },
  })
  if (!annotations.length) {
    // get from cache
    const cacheAnnotation = localStorage.getItem(
      `annotation:${orderId}${examCode}`
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
  examCode: string,
  annotation: any
) {
  localStorage.setItem(
    `annotation:${orderId}${examCode}`,
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
