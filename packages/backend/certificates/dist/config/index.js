"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    DB: {
        URL: process.env.COUCHDB_URL || 'http://localhost:5984',
        USERNAME: process.env.COUCHDB_USERNAME || '4dm1n-us3r',
        PASSWORD: process.env.COUCHDB_PASSWORD || '4dm1n-p4ssw0rd!!',
    },
    API_GOTENBERG: process.env.API_GOTENBERG || 'http://localhost:30000',
});
//# sourceMappingURL=index.js.map