interface IConfig {
  DB: {
    URL: string
    USERNAME: string
    PASSWORD: string
  }
  JWT: {
    ISSUER: string
    AUDIENCE: string
  }
  METABASE: {
    URL: string
    SECRET_KEY: string
  }
  S3: {
    ENDPOINT: string
    ACCESS_KEY: string
    SECRET_KEY: string
    REGION: string
  }
  FILES_SYNC: {
    INTERVAL_MS: number
    BATCH_SIZE: number
  }
}

export default (): IConfig => ({
  DB: {
    URL: process.env.COUCHDB_URL || 'http://localhost:5984',
    USERNAME: process.env.COUCHDB_USERNAME || '4dm1n-us3r',
    PASSWORD: process.env.COUCHDB_PASSWORD || '4dm1n-p4ssw0rd!!',
  },
  JWT: {
    ISSUER: process.env.JWT_ISSUER || '',
    AUDIENCE: process.env.JWT_AUDIENCE || 'medicaly-app',
  },
  METABASE: {
    URL: process.env.METABASE_SITE_URL || 'http://localhost:3000',
    SECRET_KEY: process.env.METABASE_SECRET_KEY || 'NO-SECRET-KEY',
  },
  S3: {
    ENDPOINT: process.env.S3_ENDPOINT || 'http://localhost:9000',
    ACCESS_KEY: process.env.S3_ACCESS_KEY || '',
    SECRET_KEY: process.env.S3_SECRET_KEY || '',
    REGION: process.env.S3_REGION || 'us-east-1',
  },
  FILES_SYNC: {
    INTERVAL_MS: parseInt(process.env.FILES_SYNC_INTERVAL_MS || '300000', 10),
    BATCH_SIZE: parseInt(process.env.FILES_SYNC_BATCH_SIZE || '50', 10),
  },
})
