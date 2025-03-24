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
  const response = await http.get(`/reports/rips/${invoiceId}?format=${format}`)

  if (response.status === 200) {
    // is file json or xlsx, download it
    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: `application/${format}`,
    })
    const url = window.URL.createObjectURL(blob)
    console.log('url', url)
    const a = document.createElement('a')
    a.href = url
    a.download = `report.${format}`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
