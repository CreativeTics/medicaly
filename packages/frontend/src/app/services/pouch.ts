import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { DB_AUTH, DB_URL } from "../../config";
import { useAuthStore } from "@/store/auth";

PouchDB.plugin(PouchDBFind);

export enum DB {
  AUTH = "auth",
  GENERAL = "general",
  MEDICAL = "medical",
  FILES = "files",
}

export class PouchService {
  private dbs: Map<string, PouchDB.Database> = new Map();
  private db: PouchDB.Database | undefined;

  constructor() {
    const allDB = [DB.AUTH, DB.GENERAL, DB.MEDICAL, DB.FILES];
    allDB.forEach((dbName) => {
      this.dbs.set(
        dbName,
        new PouchDB(`${DB_URL}/${dbName}`, { auth: DB_AUTH })
      );
    });
  }

  public use(dbName: DB): this {
    if (this.dbs.has(dbName)) {
      this.db = this.dbs.get(dbName);
    }
    return this;
  }

  public async get(docId: string): Promise<any> {
    const result = await this.db?.get(docId);
    return this.mapCommonFields(result);
  }

  public async create(doc: any) {
    const user = useAuthStore().user;
    doc.createdAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
    doc.updatedBy = user?.id ?? "";
    doc.isDeleted = false;
    return await this.db?.post(doc);
  }

  public async update(doc: any) {
    const oldDoc = await this.get(doc.id);
    const user = useAuthStore().user;
    doc.createdAt = oldDoc?.createdAt;
    doc.updatedAt = new Date().toISOString();
    doc.updatedBy = user?.id ?? "";
    doc.isDeleted = false;
    doc._rev = oldDoc?.rev;
    doc._id = oldDoc?.id;

    delete doc.id;
    delete doc.rev;
    // TODO: emit audit event
    return await this.db?.put(doc);
  }

  // public async delete(doc: any) {
  //   return this.db?.remove(doc);
  // }

  public read() {
    return this.db?.allDocs({ include_docs: true });
  }

  public async find(query: PouchDB.Find.FindRequest<any>) {
    query.fields = query.fields?.map((field) =>
      field === "id" ? "_id" : field === "rev" ? "_rev" : field
    );

    query.selector = {
      ...query.selector,
      isDeleted: false,
    };

    const result = await this.db?.find(query);
    return result?.docs.map((doc) => this.mapCommonFields(doc));
  }

  public destroy() {
    this.db?.destroy();
  }

  private mapCommonFields(doc: any) {
    return {
      id: doc._id,
      rev: doc._rev,
      ...doc,
    };
  }
}
