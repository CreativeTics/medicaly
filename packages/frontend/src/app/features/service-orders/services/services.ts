import { getData } from "../../../core/services/get-table/";

import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();
const doctype = "contract-services";

export async function getList(contractId: string, examType: string) {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ["id", "code", "name", "amount"],
    where: {
      contractId: contractId,
      examType: examType,
    },
  });

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      name: doc.name,
      amount: doc.amount,
    };
  });
}
