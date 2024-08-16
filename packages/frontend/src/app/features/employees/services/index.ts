import { useFileAttachment } from '@/app/core/composable/useFileAttachment'
import { getData } from '../../../core/services/get-table/'

import { PouchService, DB } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'employees'

export async function getList() {
  const data = await getData<any[]>({
    entity: 'general:employees',
    fields: [
      'id',
      'documentNumber',
      'fullName',
      'positionName',
      'user',
      'updatedAt',
    ],
  })

  let users: any = []
  for (const doc of data) {
    const user = doc.user ? await pouch.use(DB.AUTH).get(doc.user) : {}
    users.push({
      id: doc.id,
      documentNumber: doc.documentNumber,
      fullName: doc.fullName,
      position: doc.positionName,
      user: user.name,
      updatedAt: doc.updatedAt,
    })
  }
  return users
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    documentNumber: doc.documentNumber,
    fullName: doc.fullName,
    position: doc.position,
    licenseNumber: doc.licenseNumber,
    licenseName: doc.licenseName,
    signature: doc.signature,
    exams: doc.exams,
    user: doc.user,
  }
}

export async function create(entity: any): Promise<boolean> {
  const position = await pouch.use(DB.GENERAL).get(entity.position)
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
    positionName: position.name,
  })
  await addEmployeeRelationToUser(entity.id, entity.user)
  await saveSignatureImage(entity)
  return !!response?.ok
}

export async function edit(id: string, entity: any): Promise<boolean> {
  console.log('edit', id)

  const position = await pouch.use(DB.GENERAL).get(entity.position)

  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
    positionName: position.name,
  })
  await addEmployeeRelationToUser(id, entity.user)
  await saveSignatureImage(entity)

  return !!response?.ok
}

async function addEmployeeRelationToUser(employeeId: string, userId: string) {
  if (!userId) {
    return
  }

  const user = await pouch.use(DB.AUTH).get(userId)

  if (user.relations?.[0] && user.relations[0].value !== employeeId) {
    throw new Error('El usuario ya esta asignado a otro empleado')
  }

  user.relations = [
    {
      type: 'employee',
      value: employeeId,
    },
  ]
  await pouch.use(DB.AUTH).update(user)
}

async function saveSignatureImage(entity: any) {
  if (!entity.signature) {
    return
  }
  useFileAttachment().changeBucket(entity.signature, 'employees')
}
