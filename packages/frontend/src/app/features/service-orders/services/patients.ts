import { getData } from '../../../core/services/get-table/'

import { DB, PouchService } from '../../../services/pouch'

const pouch = new PouchService()

export async function getDocumentTypes() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:identification-types`,
    fields: ['id', 'code', 'name'],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      name: doc.name,
    }
  })
}

export async function getContractPositions(contractId: string) {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:contract-positions`,
    fields: ['id', 'code', 'name'],
    where: {
      contractId: contractId,
    },
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      name: doc.name,
    }
  })
}

export async function searchPatient(doctype: string, docNumber: string) {
  const data = await getData<any[]>({
    entity: `${DB.MEDICAL}:patients`,
    fields: ['id', 'name', 'lastName'],
    where: {
      documentType: doctype,
      documentNumber: docNumber,
    },
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
      lastName: doc.lastName,
    }
  })
}

export async function getPatient(patientDataId: string) {
  const patientData = await pouch.use(DB.MEDICAL).get(patientDataId)
  return patientData
}
