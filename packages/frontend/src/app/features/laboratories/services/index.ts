import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();
const doctype = "laboratories";

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ["id", "name", "exams", "updatedAt"],
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      exams: doc.exams.length,
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id);
  return {
    name: doc.name,
    exams: doc.exams,
  };
}

export async function create(entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
  });
  console.log("edit", response);
  return true;
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
  });
  console.log("edit", response);

  return true;
}
