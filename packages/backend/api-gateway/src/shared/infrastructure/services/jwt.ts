import config from '../../../config'

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
  iss?: string
  aud?: string
  iat?: number
  exp?: number
}

const TOKEN_EXPIRATION = '2h'

let privateKey: any
let publicKey: any
let jwks: { keys: any[] }

let keysReady: Promise<void> | null = null

async function initKeys(): Promise<void> {
  const { generateKeyPair, exportJWK } = await import('jose')

  const pair = await generateKeyPair('RS256')
  privateKey = pair.privateKey
  publicKey = pair.publicKey

  const publicJwk = await exportJWK(publicKey)
  publicJwk.alg = 'RS256'
  publicJwk.use = 'sig'
  publicJwk.kid = 'medicaly-auth-1'

  jwks = { keys: [publicJwk] }
}

function ensureKeys(): Promise<void> {
  if (!keysReady) {
    keysReady = initKeys()
  }
  return keysReady
}

export class JwtService {
  static async sign(
    payload: Omit<JwtTokenPayload, 'iss' | 'aud' | 'iat' | 'exp'>,
  ): Promise<string> {
    await ensureKeys()
    const { SignJWT } = await import('jose')
    const { JWT } = config()
    return new SignJWT(payload as Record<string, unknown>)
      .setProtectedHeader({ alg: 'RS256', kid: 'medicaly-auth-1' })
      .setIssuer(JWT.ISSUER)
      .setAudience(JWT.AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(privateKey)
  }

  static async verify(token: string): Promise<JwtTokenPayload> {
    await ensureKeys()
    const { jwtVerify } = await import('jose')
    const { JWT } = config()
    const { payload } = await jwtVerify(token, publicKey, {
      issuer: JWT.ISSUER,
      audience: JWT.AUDIENCE,
    })
    return payload as unknown as JwtTokenPayload
  }

  static async getJwks(): Promise<{ keys: any[] }> {
    await ensureKeys()
    return jwks
  }
}
