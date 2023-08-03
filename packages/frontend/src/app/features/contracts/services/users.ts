import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

const pouch = new PouchService();
const doctype = "users";

export async function getList(contractId: string) {
  const data = await getData<any[]>({
    entity: `${DB.AUTH}:${doctype}`,
    fields: ["id", "name", "username", "roleName", "subsidiaries", "updatedAt"],
    where: {
      contractId: contractId,
    },
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      role: doc.roleName,
      username: doc.username,
      subsidiaries: doc.subsidiaries.length,
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getEntity(id: string): Promise<any> {
  const doc = await pouch.use(DB.AUTH).get(id);
  return {
    id: doc.id,
    name: doc.name,
    tempPassword: doc.tempPassword,
    encodedPassword: doc.encodedPassword,
    username: doc.username,
    role: doc.role,
    subsidiaries: doc.subsidiaries,
    contractId: doc.contractId,
  };
}

export async function create(
  contractId: string,
  entity: any
): Promise<boolean> {
  const role = await pouch.use(DB.AUTH).get(entity.role);

  const encodedPassword = Base64.stringify(sha256(entity.tempPassword));

  const response = await pouch.use(DB.AUTH).create({
    doctype,
    ...entity,
    roleName: role.name,
    type: "contract-user",
    contractId: contractId,
    encodedPassword,
  });
  console.log("create", response);
  return true;
}

export async function edit(
  contractId: string,
  id: string,
  entity: any
): Promise<boolean> {
  const role = await pouch.use(DB.AUTH).get(entity.role);
  const oldUser = await pouch.use(DB.AUTH).get(id);

  if (oldUser.tempPassword !== entity.tempPassword) {
    entity.encodedPassword = Base64.stringify(sha256(entity.tempPassword));
  }

  const response = await pouch.use(DB.AUTH).update({
    doctype,
    id,
    ...entity,
    roleName: role.name,
    type: "contract-user",
    contractId: contractId,
  });
  console.log("edit", response);
  return true;
}

export async function deleteEntity(id: string): Promise<boolean> {
  await pouch.use(DB.AUTH).delete(id);

  return true;
}
