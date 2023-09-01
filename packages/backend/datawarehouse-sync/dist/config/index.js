"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    CRON_EXPRESSION: process.env.CRON_JOB_EXPRESSION || '15 * * * * *',
    DB: {
        URL: process.env.COUCHDB_URL || 'http://localhost:5984',
        USERNAME: process.env.COUCHDB_USERNAME || '4dm1n-us3r',
        PASSWORD: process.env.COUCHDB_PASSWORD || '4dm1n-p4ssw0rd!!',
    },
    WAREHOUSE_DB: {
        URL: process.env.WAREHOUSE_DB_URL ||
            'postgres://postgres:pgp4ssw0rd@localhost:5432/medicaly',
    },
});
//# sourceMappingURL=index.js.map