import { query } from '../util/pg-client'
import { getDoc, searchDocs } from './get-couch-changes'

const annotationsStatus = {
  FINISHED: 'FINALIZADO',
}

export async function syncMedicalAnnotations() {
  const todayAnnotations = await searchDocs('medical', {
    doctype: 'annotations',
    updatedAt: new Date().toISOString().split('T')[0],
    status: annotationsStatus.FINISHED,
  })

  console.log(`medical :: found ${todayAnnotations.length} annotations`)

  for (const annotation of todayAnnotations) {
    await upsertAnnotation(annotation)
  }
}

async function upsertAnnotation(annotation: any) {
  const exist = await query(
    `SELECT * FROM annotations WHERE id = '${annotation._id}'`
  )
  if (exist.rows.length > 0) return // already synced

  const serviceOrder = await getDoc('general', annotation.orderId)

  const service = serviceOrder.services.find(
    (s: any) => s.id === annotation.serviceId
  )

  await query(
    `
    INSERT INTO public.annotations
    (id,
     ticket_id,
     service_code,
     service_description,
     exam_code,
     exam_description,
     exam_version,
     patient_id, 
     patient_data_id, 
     create_at)
    VALUES(
    '${annotation._id}', 
    '${annotation.orderId}',
    '${service.code}', 
    '${service.name}', 
    '${annotation.examCode}', 
    '', 
    '${annotation.examVersion}', 
    '${serviceOrder.patientId}', 
    '${serviceOrder.patientDataId}', 
    '${annotation.createdAt}');
  `
  )

  const formFields = await getFormFieldsFromExam(annotation.examId)

  for (const field of formFields) {
    await query(
      `
      INSERT INTO public.annotation_answers
      (
      annotation_id, 
      field_code, 
      field_label,
      answer,
      field_type)
      VALUES(
      '${annotation._id}', 
      '${field.fielName}', 
      '${field.label}',
      '${annotation?.[`${field.fielName}`] ?? ''}', 
      '${field.type}');
    `
    )
  }

  console.log(`medical :: annotation ${annotation._id} synced`)
}

async function getFormFieldsFromExam(
  examId: string
): Promise<FieldExtraction[]> {
  const exam = await getDoc('medical', examId)

  const form = JSON.parse(exam.form ?? '{}') as Form
  const fields: FieldExtraction[] = []

  for (const group of form.groups) {
    for (const field of group.fields) {
      fields.push({
        fielName: field.name,
        label: field.label,
        type: field.type,
      })
    }
  }

  return fields
}

// Type definitions (for documentation purposes only)
interface Form {
  name: string
  groups: Group[]
}

interface Group {
  name: string
  description: string
  fields: Field[]
}

interface Field {
  name?: string
  label?: string
  type: string
  props: Props
  rules?: string[]
  default?: string
}

interface Props {
  placeholder?: string
  required?: boolean
  rows?: number
  class?: string
  options?: Option[]
  multiple?: boolean
  text?: string
  disabled?: boolean
  sizeModel?: string
  weightModel?: string
}

interface Option {
  id: string
  name: string
}

interface FieldExtraction {
  fielName: string
  label: string
  type: string
}
