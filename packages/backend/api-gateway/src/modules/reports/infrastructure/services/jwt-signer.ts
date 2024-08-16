import jwt from 'jsonwebtoken'

export default class JWTSigner {
  constructor() {}

  sign(payload: any, secret: string) {
    return jwt.sign(payload, secret)
  }
}
