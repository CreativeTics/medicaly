import { getData, getDataPaginated } from '../../../core/services/get-table/'
import { formatDate } from '../../../core/util/dates'

import { PouchService, DB } from '../../../services/pouch'

const pouch = new PouchService()
const examDoctype = 'exams'
const versionDoctype = 'exam-versions'

export interface ExamListFilters {
  type?: string
  searchText?: string
  page?: number
  perPage?: number
}

export async function getList(filters?: ExamListFilters): Promise<{ rows: any[]; total: number }> {
  const where: any = {}
  const page = filters?.page ?? 1
  const perPage = filters?.perPage ?? 10

  if (filters?.type) {
    where.type = filters.type
  }

  const { rows: data, total: rawTotal } = await getDataPaginated<any[]>({
    entity: `${DB.MEDICAL}:${examDoctype}`,
    fields: ['id', 'type', 'code', 'name', 'currentVersion', 'updatedAt'],
    sort: [{ code: 'asc' }],
    where,
    limit: filters?.searchText ? undefined : perPage,
    skip: filters?.searchText ? undefined : (page - 1) * perPage,
  })

  let results = data.map((doc: any) => ({
    id: doc.id,
    type: doc.type,
    name: doc.name,
    code: doc.code,
    version: doc.currentVersion,
    updatedAt: formatDate(doc.updatedAt, true),
  }))

  // Text search is applied client-side on PouchDB results
  // When searching, we fetch all records (no limit/skip) and filter + paginate here
  if (filters?.searchText) {
    const term = filters.searchText.toLowerCase()
    results = results.filter(
      (row) =>
        row.name?.toLowerCase().includes(term) ||
        row.code?.toLowerCase().includes(term),
    )
    const total = results.length
    const start = (page - 1) * perPage
    return { rows: results.slice(start, start + perPage), total }
  }

  return { rows: results, total: rawTotal }
}

export async function getEntity(id: string): Promise<any> {
  const examDoc = await pouch.use(DB.MEDICAL).get(id)

  // Load the current version data
  let versionData: any = {}
  if (examDoc.currentVersionId) {
    versionData = await pouch.use(DB.MEDICAL).get(examDoc.currentVersionId)
  }

  return {
    type: examDoc.type,
    name: examDoc.name,
    code: examDoc.code,
    requireCertificate: versionData.requireCertificate,
    certificateTemplate: versionData.certificateTemplate,
    requireConsent: versionData.requireConsent,
    consentTemplate: versionData.consentTemplate,
    printTemplate: versionData.printTemplate,
    form: JSON.parse(JSON.stringify(versionData.form ?? '[]', null, 2)),
    version: examDoc.currentVersion,
  }
}

export async function create(entity: any): Promise<boolean> {
  // Create the exam-version document first
  // Include name, code, type for backward compatibility with backend reads
  const versionDoc = await pouch.use(DB.MEDICAL).create({
    doctype: versionDoctype,
    examCode: entity.code,
    code: entity.code,
    name: entity.name,
    type: entity.type,
    version: 1,
    form: entity.form,
    requireCertificate: entity.requireCertificate,
    certificateTemplate: entity.certificateTemplate,
    requireConsent: entity.requireConsent,
    consentTemplate: entity.consentTemplate,
    printTemplate: entity.printTemplate,
  })

  // Create the exam header document
  await pouch.use(DB.MEDICAL).create({
    doctype: examDoctype,
    type: entity.type,
    code: entity.code,
    name: entity.name,
    currentVersion: 1,
    currentVersionId: versionDoc?.id,
  })

  return true
}

export async function edit(entity: any, examId: string): Promise<boolean> {
  const newVersion = Number(entity.version ?? 0) + 1

  // Create a new exam-version document (immutable)
  // Include name, code, type for backward compatibility with backend reads
  const versionDoc = await pouch.use(DB.MEDICAL).create({
    doctype: versionDoctype,
    examId,
    examCode: entity.code,
    code: entity.code,
    name: entity.name,
    type: entity.type,
    version: newVersion,
    form: entity.form,
    requireCertificate: entity.requireCertificate,
    certificateTemplate: entity.certificateTemplate,
    requireConsent: entity.requireConsent,
    consentTemplate: entity.consentTemplate,
    printTemplate: entity.printTemplate,
  })

  // Update the exam header with the new version info
  await pouch.use(DB.MEDICAL).updateOnly(examId, {
    name: entity.name,
    currentVersion: newVersion,
    currentVersionId: versionDoc?.id ?? '',
  })

  return true
}

export async function getExamTypes(): Promise<{ code: string; name: string }[]> {
  const data = await getData<any[]>({
    entity: `${DB.MEDICAL}:exam-types`,
    fields: ['code', 'name'],
  })

  return data.map((doc: any) => ({
    code: doc.code,
    name: doc.name,
  }))
}

export async function deleteExam(id: string): Promise<boolean> {
  const exam = await pouch.use(DB.MEDICAL).get(id)

  // Delete all version documents for this exam
  const allVersions = await pouch.use(DB.MEDICAL).find({
    selector: {
      doctype: versionDoctype,
      examCode: exam.code,
    },
  })

  if (allVersions?.length) {
    for (const doc of allVersions) {
      await pouch.use(DB.MEDICAL).delete(doc.id)
    }
  }

  // Delete the exam header
  await pouch.use(DB.MEDICAL).delete(id)

  return true
}
