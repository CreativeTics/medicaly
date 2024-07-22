import { couchHttp } from '../../../../shared/infrastructure/databases/util/http'
import { PatientsRepository } from '../../domain/patient-repository'

export class MixedPatientRepository implements PatientsRepository {
  getById = async (id: string) => {
    const patientResponse = await couchHttp.get(`/medical/${id}`)
    if (patientResponse.status !== 200) {
      return
    }
    const patientRow = patientResponse.data

    console.log(id)
    return {
      id: patientRow.id,
      documentNumber: patientRow.documentNumber,
    }
  }

  getHistory = async (patientId: string, documentNumber: string) => {
    return Promise.resolve([
      {
        id: 'mockId-123',
        code: 'mockCode-123',
        date: '2024-02-01',
        contractId: 'mockContractId-123',
      },
      {
        id: 'mockId-124',
        code: 'mockCode-124',
        date: '2024-01-01',
        contractId: 'mockContractId-124',
      },
    ])
  }
}
