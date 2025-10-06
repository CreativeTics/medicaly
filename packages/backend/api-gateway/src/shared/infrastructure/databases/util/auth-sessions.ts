export class AuthSessions {
  sessions = new Map<
    string,
    {
      userId: string
      username: string
      createdAt: Date
    }
  >()
  static instance: AuthSessions = new AuthSessions()
  private constructor() {}

  get instance(): AuthSessions {
    if (!AuthSessions.instance) {
      AuthSessions.instance = new AuthSessions()
    }
    return AuthSessions.instance
  }

  add(token: string, userId: string, username: string): void {
    console.log('add', token, userId, username)
    this.sessions.set(token, {
      userId,
      username,
      createdAt: new Date(),
    })
  }
  validate(token: string): boolean {
    const session = this.sessions.get(token)
    console.log('token', token)
    console.log(
      'sessions',
      Array.from(this.sessions.entries()).map(([k]) => k)
    )
    console.log('session', session)
    if (
      !session ||
      !session.createdAt ||
      new Date().getTime() - session.createdAt.getTime() > 1000 * 60 * 60 // 1 hour
    ) {
      return false
    }
    //refresh time to the session
    session.createdAt = new Date()
    this.sessions.set(token, session)
    return true
  }

  get(token: string): string {
    const session = this.sessions.get(token)

    if (!session) {
      return ''
    }
    return session.userId
  }

  delete(token: string): void {
    this.sessions.delete(token)
  }

  list(): { token: string; userId: string; lastUsage: Date }[] {
    return Array.from(this.sessions.entries()).map(([token, session]) => ({
      token,
      userId: session.userId,
      username: session.username,
      lastUsage: session.createdAt,
    }))
  }
}
