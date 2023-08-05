import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();
const doctype = "contracts";

enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export async function getList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: [
      "id",
      "documentNumber",
      "name",
      "email",
      "phone",
      "status",
      "updatedAt",
    ],
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      documentNumber: doc.documentNumber,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      status: doc.status === Status.ACTIVE ? "Activo" : "Inactivo",
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.GENERAL).get(id);
  return {
    id: doc.id,
    documentType: doc.documentType,
    documentNumber: doc.documentNumber,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    status: doc.status,
    billingCode: doc.billingCode,
    legalRepresentative: doc.legalRepresentative,
    city: doc.city,
    address: doc.address,
    observations: doc.observations,
  };
}

export async function create(entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).create({
    doctype,
    ...entity,
    status: entity.status ?? Status.ACTIVE,
  });
  console.log("create", response);
  return true;
}

export async function edit(id: string, entity: any): Promise<boolean> {
  const response = await pouch.use(DB.GENERAL).update({
    doctype,
    id,
    ...entity,
    status: entity.status ?? Status.ACTIVE,
  });
  console.log("edit", response);

  return true;
}
