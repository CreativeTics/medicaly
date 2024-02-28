export class AuthSessions {
  sessions = new Map<
    string,
    {
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

  add(token: string, username: string): void {
    this.sessions.set(token, {
      username,
      createdAt: new Date(),
    })
  }
  validate(token: string): boolean {
    const session = this.sessions.get(token)

    if (
      !session ||
      !session.createdAt ||
      new Date().getTime() - session.createdAt.getTime() > 1000 * 60 * 60 // 1 hour
    ) {
      return false
    }
    return true
  }

  delete(token: string): void {
    this.sessions.delete(token)
  }
}
