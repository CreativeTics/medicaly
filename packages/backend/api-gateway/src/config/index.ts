interface IConfig {
  DB: {
    URL: string
    USERNAME: string
    PASSWORD: string
  }
  METABASE: {
    URL: string
    SECRET_KEY: string
  }
}

export default (): IConfig => ({
  DB: {
    URL: process.env.COUCHDB_URL || 'http://localhost:5984',
    USERNAME: process.env.COUCHDB_USERNAME || '4dm1n-us3r',
    PASSWORD: process.env.COUCHDB_PASSWORD || '4dm1n-p4ssw0rd!!',
  },
  METABASE: {
    URL: process.env.METABASE_URL || 'http://localhost:3000',
    SECRET_KEY: process.env.METABASE_SECRET_KEY || 'NO-SECRET-KEY',
  },
})
