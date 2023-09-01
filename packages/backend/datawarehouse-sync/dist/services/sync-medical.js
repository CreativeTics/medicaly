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
exports.syncMedical = void 0;
const pg_client_1 = require("../util/pg-client");
const get_couch_changes_1 = require("./get-couch-changes");
function syncMedical() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const lastEventId = yield (0, pg_client_1.getLastEventId)('medical');
        const changes = yield (0, get_couch_changes_1.getChanges)('medical', (_a = lastEventId[0]) === null || _a === void 0 ? void 0 : _a.last_completed_sync);
        const filteredChanges = changes.data.results.filter((change) => change.doc.doctype === 'patients' ||
            change.doc.doctype === 'patients-data');
        console.log(`medical :: found ${filteredChanges.length} changes`);
        for (const change of filteredChanges) {
            if (change.doc.doctype === 'patients') {
                yield upsertPatient(change.doc);
                yield (0, pg_client_1.updateLastEventId)('medical', change.seq);
            }
            else if (change.doc.doctype === 'patients-data') {
                yield upsertPatientData(change.doc);
                yield (0, pg_client_1.updateLastEventId)('medical', change.seq);
            }
        }
        yield (0, pg_client_1.updateLastEventId)('medical', changes.data.last_seq);
        console.log(`medical :: ${filteredChanges.length} changes synced`);
    });
}
exports.syncMedical = syncMedical;
function upsertPatient(patient) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate if exists and delete if exists
        const exist = yield (0, pg_client_1.query)(`SELECT * FROM patients WHERE id = '${patient._id}'`);
        if (exist.rows.length > 0) {
            yield (0, pg_client_1.query)(`DELETE FROM patients WHERE id = '${patient._id}'`);
        }
        const documentType = yield (0, get_couch_changes_1.getDoc)('general', patient.documentType || '');
        yield (0, pg_client_1.query)(`
  INSERT INTO patients (
    id,
    is_deleted,
    document_type,
    document_number,
    full_name,
    name,
    second_name,
    last_name,
    second_last_name,
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
    $10
  )
  `, [
            patient._id,
            patient.isDeleted,
            `${documentType.code} - ${documentType.name}`,
            patient.documentNumber,
            patient.fullName,
            patient.name,
            patient.secondName,
            patient.lastName,
            patient.secondLastName,
            patient.createdAt,
        ]);
    });
}
function upsertPatientData(patientData) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate if exists and delete if exists
        const exist = yield (0, pg_client_1.query)(`SELECT * FROM patients_data WHERE id = '${patientData._id}'`);
        if (exist.rows.length > 0) {
            yield (0, pg_client_1.query)(`DELETE FROM patients_data WHERE id = '${patientData._id}'`);
        }
        const eps = yield (0, get_couch_changes_1.getDoc)('general', patientData.eps || '');
        const arl = yield (0, get_couch_changes_1.getDoc)('general', patientData.arl || '');
        const position = yield (0, get_couch_changes_1.getDoc)('general', patientData.applyPosition || '');
        const precedenceCity = yield (0, get_couch_changes_1.getDoc)('general', patientData.precedenceCity || '');
        const residenceCity = yield (0, get_couch_changes_1.getDoc)('general', patientData.residenceCity || '');
        yield (0, pg_client_1.query)(`
  INSERT INTO patients_data (
    id,
    is_deleted,
    birth_date,
    marital_status,
    blood_type,
    eps,
    eps_affiliation_type,
    arl,
    school_level,
    biological_sex,
    gender,
    apply_position,
    precedence_city,
    residence_city,
    residence_type,
    residence_address,
    residence_phone,
    accompanying_name,
    accompanying_parent,
    accompanying_address,
    responsible_name,
    responsible_parent,
    responsible_address,
    observation,
    signature_url,
    fingerprint_url,
    photo_url,
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
    $16,
    $17,
    $18,
    $19,
    $20,
    $21,
    $22,
    $23,
    $24,
    $25,
    $26,
    $27,
    $28
  )`, [
            patientData._id,
            patientData.isDeleted,
            patientData.birthDate,
            patientData.maritalStatus,
            patientData.bloodType,
            `${eps.code} - ${eps.name}`,
            patientData.epsAffiliationType,
            `${arl.code} - ${arl.name}`,
            patientData.schoolLevel,
            patientData.biologicalSex,
            patientData.gender,
            `${position.code} - ${position.name}`,
            `${precedenceCity.code} - ${precedenceCity.name}`,
            `${residenceCity.code} - ${residenceCity.name}`,
            patientData.residenceType,
            patientData.residenceAddress,
            patientData.residencePhone,
            patientData.accompanyingName,
            patientData.accompanyingParent,
            patientData.accompanyingAddress,
            patientData.responsibleName,
            patientData.responsibleParent,
            patientData.responsibleAddress,
            patientData.observation,
            patientData.signatureUrl,
            patientData.fingerprintUrl,
            patientData.photoUrl,
            patientData.createdAt,
        ]);
    });
}
//# sourceMappingURL=sync-medical.js.map