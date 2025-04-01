import { getData } from '../../../core/services/get-table/'

import { DB, PouchService } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'contract-users'

export async function getList(contractId: string) {
  if (!contractId) return []
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ['id', 'user', 'subsidiaries', 'updatedAt'],
    where: {
      contractId: contractId,
    },
  })

  let dataWithUsers: any = []
  for (const doc of data) {
    const user = doc.user ? await pouch.use(DB.AUTH).get(doc.user) : {}
    dataWithUsers.push({
      id: doc.id,
      subsidiaries: doc.subsidiaries.length,
      user: user.name,
      updatedAt: doc.updatedAt,
    })
  }
  return dataWithUsers
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id)
  return {
    id: doc.id,
    user: doc.user,
    subsidiaries: doc.subsidiaries,
    contractId: doc.contractId,
  }
}

export async function create(
  contractId: string,
  entity: any
): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
    contractId,
  })
  await addContractRelationToUser(contractId, entity.user)
  return !!response?.ok
}

export async function edit(
  contractId: string,
  id: string,
  entity: any
): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
    contractId,
  })
  await addContractRelationToUser(contractId, entity.user)
  return !!response?.ok
}

export async function deleteEntity(id: string): Promise<boolean> {
  const entity = await getEntity(id)
  await removeContractRelationFromUser(id, entity.user)
  const response = await pouch.use(DB.GENERAL).delete(id)
  return !!response?.ok
}

async function addContractRelationToUser(contractId: string, userId: string) {
  if (!userId) {
    return
  }

  const user = await pouch.use(DB.AUTH).get(userId)
  const oldRelations = user.relations || []
  user.relations = [
    ...oldRelations.filter((relation: any) => relation.value !== contractId),
    {
      type: 'contract',
      value: contractId,
    },
  ]
  await pouch.use(DB.AUTH).update(user)
}

async function removeContractRelationFromUser(
  contractId: string,
  userId: string
) {
  if (!userId) {
    return
  }

  const user = await pouch.use(DB.AUTH).get(userId)
  const oldRelations = user.relations || []
  user.relations = oldRelations.filter(
    (relation: any) => relation.value !== contractId
  )
  await pouch.use(DB.AUTH).update(user)
}
