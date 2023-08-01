import { permissions } from "../permissions/";
import { PouchService, DB } from "@/app/services/pouch";

const pouch = new PouchService();

export async function getData<T>(query: TableDataQuery): Promise<T> {
  query.where = query.where ?? [];
  query.sort = query.sort ?? [];
  const [dbName, tableName] = query.entity.split(":");
  const db = pouch.use(dbName as DB);

  const docs: any = await db.find({
    fields: query.fields,
    selector: { doctype: tableName, ...query.where },
    sort: query.sort,
  });

  return docs as T;
}

export async function getSelectData<T>(
  query: TableDataQuery,
  params?: Map<string, string>,
  selectId?: string,
  operator: string = "="
): Promise<T> {
  console.log("getSelectData", query, params, selectId, operator);

  const localQuery = { ...query };
  localQuery.where = localQuery.where ?? [];
  replaceWhereTags(localQuery, selectId);

  // if (params) {
  //   params.forEach((value, key) => {
  //     localQuery.where?.push(`${key} ${operator} '${value}'`);
  //   });
  // }

  if (localQuery.entity === "permissions") {
    return permissions as T;
  }

  // const response: any = await http.post("get-table/query", {
  //   type: "select",
  //   ...localQuery,
  // });

  return [] as T;
}

function replaceWhereTags(query: TableDataQuery, selectId?: string) {
  console.log("replaceWhereTags", query, selectId);
  // if (query.where) {
  //   query.where = query.where.map((where: string) => {
  //     return replacePayrollTags(where, true, selectId);
  //   });
  // }
}

export function replacePayrollTags(
  text: string = "",
  addQuotes: boolean = false,
  selectId?: string
): string {
  if (!text || typeof text !== "string") return text;

  text = text.replace(/:selectId/g, `'${selectId ?? ""}'`);

  if (!addQuotes) text = text?.replace(/'/gm, "");

  return text;
}

export interface TableDataQuery {
  entity: string;
  fields: string[];
  where?: {
    [key: string]: string;
  }[];
  sort?: string[];
}

export interface SelectOption {
  id: string | number | null;
  name: string;
}
