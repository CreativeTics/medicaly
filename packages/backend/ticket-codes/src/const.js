export default () => ({
  CRON_EXPRESSION: process.env.CRON_JOB_EXPRESSION || '15 * * * * *',
  DB: {
    URL: process.env.COUCHDB_URL || 'http://localhost:5984',
    USERNAME: process.env.COUCHDB_USERNAME || 'admin',
    PASSWORD: process.env.COUCHDB_PASSWORD || 'admin',
  },
})
