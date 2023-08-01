import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();
const doctype = "exams";

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.MEDICAL}:${doctype}`,
    fields: ["id", "type", "code", "name", "version", "updatedAt"],
  });

  const uniques = data.reduce((acc: Map<string, any>, curr: any) => {
    if (acc.has(curr.code)) {
      const prev = acc.get(curr.code).version;
      if (prev < curr.version) {
        acc.set(curr.code, curr);
      }
      return acc;
    }
    acc.set(curr.code, curr);
    return acc;
  }, new Map<string, any>());

  console.log("uniques", uniques);

  return Array.from(uniques).map(([, doc]) => {
    return {
      id: doc.id,
      type: doc.type,
      name: doc.name,
      code: doc.code,
      version: doc.version,
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.MEDICAL).get(id);
  return {
    type: doc.type,
    name: doc.name,
    code: doc.code,
    form: doc.form,
    version: doc.version,
  };
}

export async function create(entity: any): Promise<boolean> {
  entity.version = 1;
  const response = await pouch.use(DB.MEDICAL).create({
    doctype,
    ...entity,
  });
  console.log("create", response);
  return true;
}

export async function edit(id: string, entity: any): Promise<boolean> {
  entity.version = Number(entity.version ?? 0) + 1;
  const response = await pouch.use(DB.MEDICAL).create({
    doctype,
    id,
    ...entity,
  });
  console.log("edit", response);

  return true;
}
