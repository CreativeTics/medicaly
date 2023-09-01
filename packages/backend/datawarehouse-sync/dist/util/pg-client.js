"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastEventId = exports.getLastEventId = exports.disconnect = exports.query = void 0;
const pg_1 = require("pg");
const config_1 = require("../config");
const pool = new pg_1.Pool({
    connectionString: (0, config_1.default)().WAREHOUSE_DB.URL,
    max: 20,
});
function query(query, values = []) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pool.query(query, values);
    });
}
exports.query = query;
function disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pool) {
            yield pool.end();
        }
    });
}
exports.disconnect = disconnect;
function getLastEventId(database) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield pool.query(`SELECT * FROM sync_control WHERE database = '${database}' `)).rows;
    });
}
exports.getLastEventId = getLastEventId;
function updateLastEventId(database, lastEventId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.query(`UPDATE sync_control SET last_completed_sync = '${lastEventId}' WHERE database = '${database}' `);
    });
}
exports.updateLastEventId = updateLastEventId;
//# sourceMappingURL=pg-client.js.map