export default class JWTSigner {
  constructor() {}

  async sign(payload: Record<string, unknown>, secret: string): Promise<string> {
    const { SignJWT } = await import('jose')
    const secretKey = new TextEncoder().encode(secret)
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secretKey)
  }
}
