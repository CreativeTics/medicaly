export interface GetSessionUserResponse {
  id: string
  username: string
  type: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
  relations: relation[]
}

interface relation {
  contractId: string
  contractName: string
  subsidiaries: string[]
}
