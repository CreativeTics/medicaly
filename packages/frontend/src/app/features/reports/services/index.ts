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

export const getRipsReport = async (
  invoiceId: string,
  format: 'xlsx' | 'json'
): Promise<void> => {
  const response = await http.get(
    `/reports/rips/${invoiceId}?format=${format}`,
    {
      responseType: 'arraybuffer',
    }
  )

  if (response.status === 200) {
    const blob = new Blob([response.data], { type: `application/${format}` })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report.${format}`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
