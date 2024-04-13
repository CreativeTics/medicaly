import { getData } from '../../../core/services/get-table/'

import { PouchService, DB } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'laboratories'

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ['id', 'name', 'exams', 'user', 'updatedAt'],
  })

  let dataWithUsers: any = []
  for (const doc of data) {
    const user = doc.user ? await pouch.use(DB.AUTH).get(doc.user) : {}
    dataWithUsers.push({
      id: doc.id,
      name: doc.name,
      exams: doc.exams.length,
      user: user.name,
      updatedAt: doc.updatedAt,
    })
  }
  return dataWithUsers
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    name: doc.name,
    exams: doc.exams,
    user: doc.user,
  }
}

export async function create(entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
  })
  await addLaboratoryRelationToUser(entity.id, entity.user)
  return !!response?.ok
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
  })
  console.log('edit', response)
  await addLaboratoryRelationToUser(id, entity.user)
  return !!response?.ok
}

async function addLaboratoryRelationToUser(
  laboratoryId: string,
  userId: string
) {
  if (!userId) {
    return
  }

  const user = await pouch.use(DB.AUTH).get(userId)
  const oldRelations = user.relations || []
  user.relations = [
    ...oldRelations.filter((relation: any) => relation.value !== laboratoryId),
    {
      type: 'laboratory',
      value: laboratoryId,
    },
  ]
  await pouch.use(DB.AUTH).update(user)
}
