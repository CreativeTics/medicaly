export default () => ({
  DB: {
    URL: process.env.COUCHDB_URL || 'http://localhost:5984',
    USERNAME: process.env.COUCHDB_USERNAME || '4dm1n-us3r',
    PASSWORD: process.env.COUCHDB_PASSWORD || '4dm1n-p4ssw0rd!!',
  },
  GOTENBERG_ENDPOINT: process.env.GOTENBERG_ENDPOINT || 'http://localhost:3000',
})
