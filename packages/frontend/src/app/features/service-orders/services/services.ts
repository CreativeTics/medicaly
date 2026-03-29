import { getData } from '../../../core/services/get-table/'

import { DB, PouchService } from '../../../services/pouch'

const pouch = new PouchService()
const doctype = 'contract-services'

export interface ServiceListItem {
  id: string
  code: string
  name: string
  missingExams: string[]
}

export async function getList(
  contractId: string,
  examType?: string
): Promise<ServiceListItem[]> {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: ['id', 'code', 'name', 'amount'],
    where: {
      contractId: contractId,
      examType,
    },
  })

  // Fetch full service docs to get their exam codes
  const services = await Promise.all(
    data.map(async (doc: any) => {
      const fullService = await pouch.use(DB.GENERAL).get(doc.id)
      const examCodes: string[] = [
        ...(fullService.exams ?? []),
        ...(fullService.visibleExams ?? []),
      ]

      // Query exam headers to check which codes exist
      let foundCodes: string[] = []
      if (examCodes.length > 0) {
        const existingExams = await getData<{ code: string }[]>({
          entity: `${DB.MEDICAL}:exams`,
          fields: ['code'],
          where: {
            code: { $in: examCodes },
          },
        })
        foundCodes = existingExams.map((e) => e.code)
      }

      const missingExams = examCodes.filter(
        (code) => !foundCodes.includes(code)
      )

      return {
        id: doc.id,
        code: doc.code,
        name: doc.name,
        missingExams,
      }
    })
  )

  return services
}
