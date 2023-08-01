import { getData } from "../../../../core/services/get-table/";

import { PouchService, DB } from "../../../../services/pouch";

const pouch = new PouchService();

export async function getRoles() {
  const data = await getData<any[]>({
    entity: "auth:roles",
    fields: ["id", "name", "description", "permissions", "updatedAt"],
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      description: doc.description,
      permissions: doc.permissions.length,
      updatedAt: doc.updatedAt,
    };
  });
}

export async function getRole(id: string): Promise<Role> {
  const doc = await pouch.use(DB.AUTH).get(id);
  return {
    name: doc.name,
    description: doc.description,
    permissions: doc.permissions,
  };
}

export async function create(role: Role): Promise<boolean> {
  const response = await pouch.use(DB.AUTH).create({
    doctype: "roles",
    ...role,
  });
  console.log("edit", response);
  return true;
}

export async function edit(id: string, role: Role): Promise<boolean> {
  const response = await pouch.use(DB.AUTH).update({
    doctype: "roles",
    id,
    ...role,
  });
  console.log("edit", response);

  return true;
}

export interface Role {
  name: string;
  description?: string;
  permissions: string[];
}
