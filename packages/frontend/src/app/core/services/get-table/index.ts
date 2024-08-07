import { useAuthStore } from '@/store/auth'
import { permissions, userTypes } from '../permissions/'
import { PouchService, DB } from '@/app/services/pouch'

const pouch = new PouchService()

export async function getData<T>(
  query: TableDataQuery,
  index?: getDataIndex
): Promise<T> {
  query.where = query.where ?? {}
  query.sort = query.sort ?? []
  const [dbName, tableName] = query.entity.split(':')
  const db = pouch.use(dbName as DB)
  console.log('getData', query)

  if (index) {
    await db.createIndex({
      index: {
        fields: index.fields,
        name: index.name,
        partial_filter_selector: index.selector,
      },
    })
  }

  const docs: any = await db.find({
    use_index: index?.name,
    fields: query.fields,
    selector: { doctype: tableName, ...query.where },
    sort: query.sort,
    limit: query.limit || 1000,
  })

  return docs as T
}

export async function getSelectData<T>(
  query: TableDataQuery,
  params?: Map<string, string>,
  selectId?: string
): Promise<T> {
  const localQuery = { ...query }
  localQuery.where = localQuery.where ?? {}
  selectId = selectId ?? 'id'
  // replaceWhereTags(localQuery, selectId)

  if (localQuery.entity === 'permissions') {
    return permissions as T
  }

  if (localQuery.entity === 'userTypes') {
    return userTypes as T
  }

  if (params) {
    localQuery.where = {
      ...localQuery.where,
      ...Object.fromEntries(params.entries()),
    }
  }

  if (localQuery.entity === 'user-contract-subsidiaries') {
    return (await getContractSubsidiariesForUser(
      localQuery?.where?.contractId
    )) as T
  }

  let data = (await getData<T>(localQuery)) as T[]

  if (localQuery.entity === 'medical:exams') {
    const uniques = data.reduce((acc: Map<string, any>, curr: any) => {
      if (acc.has(curr.code)) {
        const prev = acc.get(curr.code).version
        if (prev < curr.version) {
          acc.set(curr.code, curr)
        }
        return acc
      }
      acc.set(curr.code, curr)
      return acc
    }, new Map<string, any>())

    data = Array.from(uniques).map(([, doc]) => {
      return {
        id: doc.id,
        name: doc.name,
        code: doc.code,
        version: doc.version,
        updatedAt: doc.updatedAt,
      }
    }) as T[]
  }

  return applyModifiers(data, query) as T
}

function applyModifiers(data: any[], query: TableDataQuery) {
  if (query.modifier?.concat) {
    data = data.map((_) => {
      return {
        ..._,
        concat: query.modifier?.concat?.reduce(
          (accumulator, acc) => accumulator + (_[acc] ?? acc),
          ''
        ),
      }
    })
  }

  return data
}

// function replaceWhereTags(query: TableDataQuery, selectId?: string) {
//   // query.where = query.where ?? {}
//   // query.where = replacePayrollTags(JSON.stringify(query.where), true, selectId)
// }

export function replacePayrollTags(
  text: string = '',
  addQuotes: boolean = false,
  selectId?: string
): string {
  if (!text || typeof text !== 'string') return text

  text = text.replace(/:selectId/g, `'${selectId ?? ''}'`)

  if (!addQuotes) text = text?.replace(/'/gm, '')

  return text
}

export interface TableDataQuery {
  entity: string
  fields: string[]
  where?: any
  sort?: Array<string | { [propName: string]: 'asc' | 'desc' }> | undefined
  modifier?: {
    concat?: string[]
  }
  limit?: number
}

export interface SelectOption {
  id: string | number | null
  name: string
}

export interface getDataIndex {
  fields: string[]

  /** Name of the index, auto-generated if you don't include it */
  name?: string | undefined

  /** The same syntax as the selector you’d pass to find(), and only documents matching the selector will be included in the index. */
  selector?: PouchDB.Find.Selector | undefined
}

export async function getContractSubsidiariesForUser(
  contractId: string
): Promise<SelectOption[]> {
  const user = useAuthStore().user
  const where: any = {
    contractId,
  }
  if (user && user?.type != 'employee' && user.relations.length > 0) {
    // get all subsidiaries for the user
    const data = await getData<any[]>({
      entity: `${DB.GENERAL}:contract-users`,
      fields: ['id', 'subsidiaries'],
      where: {
        user: user.id,
        contractId: contractId,
      },
    })
    const subsidiaries = new Set(data.map((_) => _.subsidiaries).flat())

    if (subsidiaries.size > 0) {
      where['_id'] = {
        $in: Array.from(subsidiaries),
      }
    }
  }

  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:contract-subsidiaries`,
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
