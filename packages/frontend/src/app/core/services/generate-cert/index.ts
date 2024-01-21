import axios from 'axios'

export async function generateInformedConsent(orderId: string) {
  const certificate = await axios.post(
    'http://localhost:3005/api/certificates/',
    {
      order: orderId,
      code: 'INFORMED-CONSENT',
    }
  )
  return certificate.data
}
