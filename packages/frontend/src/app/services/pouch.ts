import { useAuthStore } from '@/store/auth'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { DB_URL } from '../../config'

PouchDB.plugin(PouchDBFind)

export enum DB {
  AUTH = 'auth',
  GENERAL = 'general',
  MEDICAL = 'medical',
  FILES = 'files',
  BILLING = 'billing',
}

export class PouchService {
  private dbs: Map<string, PouchDB.Database> = new Map()
  private db: PouchDB.Database | undefined

  constructor() {
    const allDB = [DB.AUTH, DB.GENERAL, DB.MEDICAL, DB.FILES, DB.BILLING]
    allDB.forEach((dbName) => {
      this.dbs.set(
        dbName,
        new PouchDB(`${DB_URL}/${dbName}`, {
          fetch: (url, opts) => {
            return PouchDB.fetch(url, {
              ...opts,
              headers: {
                ...opts?.headers,
                Authorization: `${useAuthStore().token}`,
                'Content-Type': 'application/json',
              },
            }).then((res) => {
              if (!res.ok) {
                if (res.status === 401) useAuthStore().logout()
              }
              return res
            })
          },
        })
      )
    })
  }

  public use(dbName: DB): this {
    if (this.dbs.has(dbName)) {
      this.db = this.dbs.get(dbName)
      this
    }
    return this
  }

  public async get(
    docId: string,
    opts: { attachments?: boolean } = {}
  ): Promise<any> {
    const result = await this.db?.get(docId, opts)
    return this.mapCommonFields(result)
  }

  public async create(doc: any) {
    const user = useAuthStore().user
    doc.createdAt = new Date().toISOString()
    doc.updatedAt = new Date().toISOString()
    doc.updatedBy = user?.id ?? ''
    doc.isDeleted = false
    // TODO: emit audit event
    return await this.db?.post(doc)
  }

  public async update(doc: any) {
    delete doc._id
    delete doc._rev
    const oldDoc = await this.get(doc.id)
    const user = useAuthStore().user
    doc.createdAt = oldDoc?.createdAt
    doc.updatedAt = new Date().toISOString()
    doc.updatedBy = user?.id ?? ''
    doc.isDeleted = false
    doc._rev = oldDoc?.rev
    doc._id = oldDoc?.id

    delete doc.id
    delete doc.rev
    // TODO: emit audit event
    return await this.db?.put(doc)
  }

  public async updateOnly(
    docId: string,
    values: {
      [key: string]: string | number | boolean | Date
    }
  ) {
    const oldDoc = await this.get(docId)
    return this.update({ ...oldDoc, ...values })
  }

  public async delete(docId: string) {
    const oldDoc = await this.get(docId)
    const user = useAuthStore().user
    oldDoc.updatedAt = new Date().toISOString()
    oldDoc.updatedBy = user?.id ?? ''
    oldDoc.isDeleted = true
    oldDoc._rev = oldDoc?.rev
    oldDoc._id = oldDoc?.id
    delete oldDoc.id
    delete oldDoc.rev
    // TODO: emit audit event
    return await this.db?.put(oldDoc)
  }

  createIndex(index: PouchDB.Find.CreateIndexOptions) {
    return this.db?.createIndex(index)
  }

  public read() {
    return this.db?.allDocs({ include_docs: true })
  }

  public async find(query: PouchDB.Find.FindRequest<any>) {
    query.fields = query.fields?.map((field) =>
      field === 'id' ? '_id' : field === 'rev' ? '_rev' : field
    )

    query.selector = {
      ...query.selector,
      isDeleted: false,
    }

    const result = await this.db?.find(query)
    return result?.docs.map((doc) => this.mapCommonFields(doc))
  }

  /**
   * Count documents using a CouchDB MapReduce view with _count reduce.
   * Falls back to find()-based count if no view/key is provided.
   *
   * @param viewOrSelector - Either a view query object or a Mango selector (fallback).
   *   View query: { view: "counts/by_doctype", key: "exams" } or
   *               { view: "counts/by_doctype_type", key: ["exams", "EXAM"] }
   */
  public async count(
    viewOrSelector:
      | PouchDB.Find.Selector
      | { view: string; key: string | string[] },
  ): Promise<number> {
    // MapReduce view path: fast _count reduce
    if (typeof viewOrSelector === 'object' && 'view' in viewOrSelector) {
      const { view, key } = viewOrSelector
      const result = await (this.db as any).query(view, {
        reduce: true,
        group: true,
        key,
      })
      if (result.rows.length === 0) return 0
      return result.rows[0].value
    }

    // Fallback: Mango find-based count (for complex selectors)
    const result = await this.db?.find({
      selector: { ...viewOrSelector, isDeleted: false },
      fields: ['_id'],
      limit: 999999,
    })
    return result?.docs.length ?? 0
  }

  public destroy() {
    this.db?.destroy()
  }

  private mapCommonFields(doc: any) {
    const mappedDoc = {
      ...doc,
      id: doc._id,
      rev: doc._rev,
    }
    delete mappedDoc._id
    delete mappedDoc._rev
    return mappedDoc
  }
}
