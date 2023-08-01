import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();
const doctype = "employees";

export async function getList() {
  const data = await getData<any[]>({
    entity: "general:employees",
    fields: ["id", "documentNumber", "fullName", "position", "updatedAt"],
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      documentNumber: doc.documentNumber,
      fullName: doc.fullName,
      position: doc.position,
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id);
  return {
    documentNumber: doc.documentNumber,
    fullName: doc.fullName,
    position: doc.position,
    licenseNumber: doc.licenseNumber,
    licenseName: doc.licenseName,
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
  const response = await pouch.use(DB.AUTH).update({
    doctype,
    id,
    ...entity,
  });
  console.log("edit", response);

  return true;
}
