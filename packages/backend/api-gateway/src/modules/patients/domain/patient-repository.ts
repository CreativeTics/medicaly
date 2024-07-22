export interface PatientsRepository {
  getById: (id: string) => Promise<{
    id: string
    documentNumber: string
  } | null>
  getHistory: (
    patientId: string,
    documentNumber: string
  ) => Promise<
    Array<{
      id: string
      code: string
      date: string
      contractId: string
    }>
  >
}
