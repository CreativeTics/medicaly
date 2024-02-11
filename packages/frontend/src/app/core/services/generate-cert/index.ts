import axios from 'axios'

export async function generateInformedConsent(orderId: string) {
  const certificate = await axios.post('/api/certificates/', {
    order: orderId,
    code: 'INFORMED-CONSENT',
  })
  return certificate.data
}
