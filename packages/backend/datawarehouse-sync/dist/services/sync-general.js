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
let client = null;
function syncGeneral() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const lastEventId = yield (0, pg_client_1.getLastEventId)('general');
        const changes = yield (0, get_couch_changes_1.getChanges)('general', (_a = lastEventId[0]) === null || _a === void 0 ? void 0 : _a.last_completed_sync);
        const tickets = changes.data.results.filter((change) => change.doc.doctype === 'service-orders');
        console.log(`tickets :: found ${tickets.length} changes`);
        for (const change of tickets) {
            if (change.doc.doctype === 'service-orders') {
                yield upsertTicket(change.doc);
                yield (0, pg_client_1.updateLastEventId)('general', change.seq);
            }
        }
        yield (0, pg_client_1.updateLastEventId)('general', changes.data.last_seq);
        console.log(`tickets :: ${tickets.length} changes synced`);
    });
}
exports.syncGeneral = syncGeneral;
function upsertTicket(ticket) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate if exists and delete if exists
        const exist = yield (0, pg_client_1.query)(`SELECT * FROM tickets WHERE id = '${ticket._id}'`);
        if (exist.rows.length > 0) {
            yield (0, pg_client_1.query)(`DELETE FROM tickets WHERE id = '${ticket._id}'`);
        }
        const costCenter = yield (0, get_couch_changes_1.getDoc)('general', ticket.contractCostCenter || '');
        const contractSubsidiary = yield (0, get_couch_changes_1.getDoc)('general', ticket.contractSubsidiary || '');
        const subsidiary = yield (0, get_couch_changes_1.getDoc)('general', ticket.subsidiary || '');
        const position = yield (0, get_couch_changes_1.getDoc)('general', ticket.position || '');
        yield (0, pg_client_1.query)(`
    INSERT INTO tickets (
      id,
      code,
      status,
      contract_name,
      contract_cost_center,
      contract_subsidiary,
      subsidiary,
      position,
      observation,
      patient_id,
      patient_data_id,
      patient_is_new,
      order_cycle,
      services,
      is_deleted,
      created_at
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14,
      $15,
      $16
    )
  `, [
            ticket._id,
            ticket.code,
            ticket.status,
            ticket.contractName,
            `${costCenter.code} - ${costCenter.name}`,
            `${contractSubsidiary.code} - ${contractSubsidiary.name}`,
            `${subsidiary.code} - ${subsidiary.name}`,
            `${position.code} - ${position.name}`,
            ticket.observation,
            ticket.patientId || '',
            ticket.patientDataId || '',
            ticket.patientIsNew,
            JSON.stringify(ticket.orderCycle),
            JSON.stringify(ticket.services),
            ticket.isDeleted,
            ticket.createdAt,
        ]);
    });
}
//# sourceMappingURL=sync-general.js.map