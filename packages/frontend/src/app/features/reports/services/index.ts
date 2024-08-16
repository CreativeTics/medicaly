import { http } from '@/app/core/services/http'

export const getMetabaseDashboardUrl = async (
  dashboardId: number
): Promise<string> => {
  const response = await http.get(`/reports/bi/${dashboardId}`)

  if (response.status === 200) {
    return response.data.url
  }

  return ''
}
