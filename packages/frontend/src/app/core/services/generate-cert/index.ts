import { http } from '../http'

import { useAuthStore } from '@/store/auth'

export async function generateInformedConsent(orderId: string) {
  const certificate = await http.post(
    'files/api/certificates/',
    {
      order: orderId,
      code: 'INFORMED-CONSENT',
    },
    {
      headers: {
        Authorization: `${useAuthStore().token}`,
      },
    }
  )
  return certificate.data
}
