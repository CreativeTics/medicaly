import { PatientsRepository } from '../../../domain/patient-repository'
import {
  GetPatientHistoryDto,
  GetPatientHistoryResponse,
  PatientNotFoundError,
} from './'

export class GetPatientHistoryUseCase {
  constructor(private patientsRepository: PatientsRepository) {}

  async execute(dto: GetPatientHistoryDto): Promise<GetPatientHistoryResponse> {
    const patientSearch = await this.patientsRepository.getById(dto.id)
    if (!patientSearch) throw new PatientNotFoundError()

    const patientHistory = await this.patientsRepository.getHistory(
      patientSearch.id,
      patientSearch.documentNumber
    )
    let patientHistoryFiltered = patientHistory
    console.log('contracts', dto.contracts)
    if (dto.contracts.length > 0) {
      patientHistoryFiltered = patientHistory.filter((i) =>
        dto.contracts.includes(i.contractId)
      )
    }

    return {
      serviceHistory: patientHistoryFiltered,
    }
  }
}
