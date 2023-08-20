import { permissions } from '../permissions/'
import { PouchService, DB } from '@/app/services/pouch'

const pouch = new PouchService()

export async function getData<T>(query: TableDataQuery): Promise<T> {
  query.where = query.where ?? {}
  query.sort = query.sort ?? []
  const [dbName, tableName] = query.entity.split(':')
  const db = pouch.use(dbName as DB)
  console.log('getData', query)

  const docs: any = await db.find({
    fields: query.fields,
    selector: { doctype: tableName, ...query.where },
    sort: query.sort,
    limit: 1000,
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

  if (params) {
    localQuery.where = {
      ...localQuery.where,
      ...Object.fromEntries(params.entries()),
    }
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
  sort?: string[]
  modifier?: {
    concat?: string[]
  }
}

export interface SelectOption {
  id: string | number | null
  name: string
}
