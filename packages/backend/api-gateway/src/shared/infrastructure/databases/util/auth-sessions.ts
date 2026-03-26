export class TokenBlacklist {
  private revokedTokens = new Map<string, number>() // token -> expiration timestamp
  static instance: TokenBlacklist = new TokenBlacklist()

  private constructor() {
    // Clean expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now()
      this.revokedTokens.forEach((expiresAt, token) => {
        if (now >= expiresAt) {
          this.revokedTokens.delete(token)
        }
      })
    }, 5 * 60 * 1000)
  }

  /**
   * Revoke a token until its natural expiration time.
   * @param token - The JWT string to revoke
   * @param expiresAt - The token's expiration timestamp in ms. Defaults to 1 hour from now.
   */
  revoke(token: string, expiresAt?: number): void {
    const ttl = expiresAt ?? Date.now() + 60 * 60 * 1000
    this.revokedTokens.set(token, ttl)
  }

  /**
   * Check if a token has been revoked.
   */
  isRevoked(token: string): boolean {
    if (!this.revokedTokens.has(token)) {
      return false
    }

    const expiresAt = this.revokedTokens.get(token)!
    if (Date.now() >= expiresAt) {
      this.revokedTokens.delete(token)
      return false
    }

    return true
  }
}
