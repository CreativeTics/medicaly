import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();
const doctype = "contract-cost-centers";

export async function getList(contractId: string) {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ["id", "code", "name", "updatedAt"],
    where: {
      contractId: contractId,
    },
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      name: doc.name,
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id);
  return {
    id: doc.id,
    code: doc.code,
    name: doc.name,
    contractId: doc.contractId,
  };
}

export async function create(entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
  });
  console.log("create", response);
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

export async function deleteEntity(id: string): Promise<boolean> {
  await pouch.use(DB.GENERAL).delete(id);

  return true;
}
