import { set } from 'zod/v4'

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

  private constructor() {
    setInterval(() => {
      //clean expired sessions every 1 minutes
      this.sessions.forEach((session, token) => {
        if (this.isExpired(session)) {
          this.sessions.delete(token)
        }
      })
    }, 60 * 1000) //1 minutes
  }

  get instance(): AuthSessions {
    if (!AuthSessions.instance) {
      AuthSessions.instance = new AuthSessions()
    }
    return AuthSessions.instance
  }

  add(token: string, userId: string, username: string): void {
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
    if (!session || this.isExpired(session)) {
      this.delete(token)
      return false
    }
    //refresh time to the session
    session.createdAt = new Date()
    this.sessions.set(token, session)
    return true
  }

  private isExpired(session: { createdAt: Date }): boolean {
    const now = new Date()
    const diff = now.getTime() - session.createdAt.getTime()
    const diffInMinutes = diff / (1000 * 60)
    return diffInMinutes > 60 // 60 minutes
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
