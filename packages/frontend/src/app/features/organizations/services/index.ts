import { PouchService, DB } from "../../../services/pouch";
import { getData } from "../../../core/services/get-table/";

const pouch = new PouchService();
const doctype = "organizations";

export async function getOrganization(): Promise<any | null> {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ["id", "name", "identification", "address"],
    limit: 1,
  });

  return data.length > 0 ? data[0] : null;
}

export async function create(organization: any): Promise<boolean> {
  await pouch.use(DB.GENERAL).create({
    doctype,
    ...organization,
  });
  return true;
}

export async function edit(id: string, organization: any): Promise<boolean> {
  await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...organization,
  });
  return true;
}
