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
exports.syncGeneral = void 0;
const pg_client_1 = require("../util/pg-client");
const get_couch_changes_1 = require("./get-couch-changes");
function syncGeneral() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const lastEventId = yield (0, pg_client_1.getLastEventId)('general');
        console.log((_a = lastEventId[0]) === null || _a === void 0 ? void 0 : _a.last_completed_sync);
        const changes = yield (0, get_couch_changes_1.getChanges)('general', (_b = lastEventId[0]) === null || _b === void 0 ? void 0 : _b.last_completed_sync);
        if (changes.data.results.length > 0) {
            for (const change of changes.data.results) {
                if (change.doc.doctype === 'service-orders') {
                    console.log(change.id);
                }
            }
            // await insertIntoWarehouse(changes.data.results)
            // await updateSyncControl(changes.data.results)
        }
    });
}
exports.syncGeneral = syncGeneral;
//# sourceMappingURL=sync-tickets.js.map