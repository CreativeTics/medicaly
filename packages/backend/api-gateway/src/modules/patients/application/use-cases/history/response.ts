export interface GetPatientHistoryResponse {
  serviceHistory: Array<{
    id: string
    code: string
    date: string
    contractId: string
  }>
}
