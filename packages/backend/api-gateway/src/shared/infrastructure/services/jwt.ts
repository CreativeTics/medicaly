export interface JwtTokenPayload {
  sub: string
  username: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
  type: string
  relations: {
    contractId: string
    contractName: string
    subsidiaries: string[]
  }[]
  iat?: number
  exp?: number
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'change-this-secret-in-production'
)

const TOKEN_EXPIRATION = '1h'

export class JwtService {
  static async sign(payload: Omit<JwtTokenPayload, 'iat' | 'exp'>): Promise<string> {
    const { SignJWT } = await import('jose')
    return new SignJWT(payload as Record<string, unknown>)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(JWT_SECRET)
  }

  static async verify(token: string): Promise<JwtTokenPayload> {
    const { jwtVerify } = await import('jose')
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JwtTokenPayload
  }
}
