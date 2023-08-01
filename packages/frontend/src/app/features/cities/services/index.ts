import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();
const doctype = "cities";

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ["id", "name", "code", "countryName", "updatedAt"],
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      code: doc.code,
      countryName: doc.countryName,
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id);
  return {
    name: doc.name,
    code: doc.code,
    country: doc.country,
  };
}

export async function create(entity: any): Promise<boolean> {
  // get country name
  const country = await pouch.use(DB.GENERAL).get(entity.country);

  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
    countryName: country.name,
  });
  console.log("create", response);
  return true;
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const country = await pouch.use(DB.GENERAL).get(entity.country);

  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
    countryName: country.name,
  });
  console.log("edit", response);

  return true;
}
