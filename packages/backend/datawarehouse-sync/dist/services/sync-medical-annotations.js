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
exports.syncMedicalAnnotations = void 0;
const pg_client_1 = require("../util/pg-client");
const get_couch_changes_1 = require("./get-couch-changes");
const annotationsStatus = {
    FINISHED: 'FINALIZADO',
};
function syncMedicalAnnotations() {
    return __awaiter(this, void 0, void 0, function* () {
        const todayAnnotations = yield (0, get_couch_changes_1.searchDocs)('medical', {
            doctype: 'annotations',
            updatedAt: new Date().toISOString().split('T')[0],
            status: annotationsStatus.FINISHED,
        });
        console.log(`medical :: found ${todayAnnotations.length} annotations`);
        for (const annotation of todayAnnotations) {
            yield upsertAnnotation(annotation);
        }
    });
}
exports.syncMedicalAnnotations = syncMedicalAnnotations;
function upsertAnnotation(annotation) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const exist = yield (0, pg_client_1.query)(`SELECT * FROM annotations WHERE id = '${annotation._id}'`);
        if (exist.rows.length > 0)
            return; // already synced
        const serviceOrder = yield (0, get_couch_changes_1.getDoc)('general', annotation.orderId);
        const service = serviceOrder.services.find((s) => s.id === annotation.serviceId);
        yield (0, pg_client_1.query)(`
    INSERT INTO public.annotations
    (id,
     ticket_id,
     service_code,
     service_description,
     exam_code,
     exam_description,
     exam_version,
     patient_id, 
     patient_data_id, 
     create_at)
    VALUES(
    '${annotation._id}', 
    '${annotation.orderId}',
    '${service.code}', 
    '${service.name}', 
    '${annotation.examCode}', 
    '', 
    '${annotation.examVersion}', 
    '${serviceOrder.patientId}', 
    '${serviceOrder.patientDataId}', 
    '${annotation.createdAt}');
  `);
        // create annotation responses  in postgresql
        const formFields = yield getFormFieldsFromExam(annotation.examId);
        for (const field of formFields) {
            yield (0, pg_client_1.query)(`
      INSERT INTO public.annotation_answers
      (
      annotation_id, 
      field_code, 
      field_label,
      answer,
      field_type)
      VALUES(
      '${annotation._id}', 
      '${field.fielName}', 
      '${field.label}',
      '${(_a = annotation === null || annotation === void 0 ? void 0 : annotation[`${field.fielName}`]) !== null && _a !== void 0 ? _a : ''}', 
      '${field.type}');
    `);
        }
        console.log(`medical :: annotation ${annotation._id} synced`);
    });
}
function getFormFieldsFromExam(examId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const exam = yield (0, get_couch_changes_1.getDoc)('medical', examId);
        const form = JSON.parse((_a = exam.form) !== null && _a !== void 0 ? _a : '{}');
        const fields = [];
        for (const group of form.groups) {
            for (const field of group.fields) {
                fields.push({
                    fielName: field.name,
                    label: field.label,
                    type: field.type,
                });
            }
        }
        return fields;
    });
}
//# sourceMappingURL=sync-medical-annotations.js.map