export class AuthSessions {
  sessions = new Map<
    string,
    {
      userId: string
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

  add(token: string, userId: string): void {
    console.log('add', token, userId)
    this.sessions.set(token, {
      userId,
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

    if (
      !session ||
      !session.createdAt ||
      new Date().getTime() - session.createdAt.getTime() > 1000 * 60 * 60 // 1 hour
    ) {
      return false
    }
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
}
