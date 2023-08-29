import { PouchService, DB } from '../../../services/pouch'
const pouch = new PouchService()

export async function getService(id: string) {
  const service = await pouch.use(DB.GENERAL).get(id)
  let exams = []

  if (service.exams) {
    exams = await Promise.all(
      service.exams.map(async (exam: any) => {
        const examDoc = await pouch.use(DB.MEDICAL).get(exam)
        return {
          id: examDoc.id,
          name: examDoc.name,
          type: examDoc.type,
          version: examDoc.version,
          form: examDoc.form,
        }
      })
    )
  }

  return {
    code: service.code,
    name: service.name,
    description: service.description,
    exams,
  }
}
