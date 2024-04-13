import { getData } from '../../../core/services/get-table/'

import { PouchService, DB } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'contract-services'

export async function getList(contractId: string) {
  if (!contractId) return []
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: [
      'id',
      'examTypeName',
      'code',
      'name',
      'amount',
      'exams',
      'showForContract',
      'visibleExams',
      'updatedAt',
    ],
    where: {
      contractId: contractId,
    },
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      examType: doc.examTypeName,
      code: doc.code,
      name: doc.name,
      amount: Number(doc.amount).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }),
      exams: doc.exams.length,
      showForContract: Boolean(doc.showForContract)
        ? `SI(${doc.visibleExams?.length})`
        : 'NO',
      visibleExams: doc.visibleExams,
      updatedAt: doc.updatedAt,
    }
  })
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    id: doc.id,
    examType: doc.examType,
    code: doc.code,
    name: doc.name,
    amount: doc.amount,
    exams: doc.exams,
    showForContract: doc.showForContract,
    visibleExams: doc.visibleExams,
    contractId: doc.contractId,
  }
}

export async function create(entity: any): Promise<boolean> {
  const examType = await pouch.use(DB.GENERAL).get(entity.examType)
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
    examTypeName: `${examType.name}:${examType.emphasis}`,
  })
  console.log('create', response)
  return true
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const examType = await pouch.use(DB.GENERAL).get(entity.examType)

  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
    examTypeName: `${examType.name}:${examType.emphasis}`,
  })
  console.log('edit', response)

  return true
}

export async function deleteEntity(id: string): Promise<boolean> {
  await pouch.use(DB.GENERAL).delete(id)

  return true
}
