import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { DB_AUTH, DB_URL } from "../../config";

PouchDB.plugin(PouchDBFind);

export enum DB {
  AUTH = "auth",
}

export class PouchService {
  private dbs: Map<string, PouchDB.Database> = new Map();
  private db: PouchDB.Database | undefined;

  constructor() {
    this.dbs.set(
      DB.AUTH,
      new PouchDB(`${DB_URL}/${DB.AUTH}`, { auth: DB_AUTH })
    );
  }

  public use(dbName: DB): this {
    if (this.dbs.has(dbName)) {
      this.db = this.dbs.get(dbName);
    }
    return this;
  }

  public create(doc: any) {
    return this.db?.post(doc);
  }

  public update(doc: any) {
    return this.db?.put(doc);
  }

  public delete(doc: any) {
    return this.db?.remove(doc);
  }

  public read() {
    return this.db?.allDocs({ include_docs: true });
  }

  public find(query: PouchDB.Find.FindRequest<any>) {
    return this.db?.find(query);
  }

  public destroy() {
    this.db?.destroy();
  }
}
