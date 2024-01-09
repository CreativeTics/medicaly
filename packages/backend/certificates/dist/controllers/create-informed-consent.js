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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCertificateController = void 0;
const ejs_service_1 = __importDefault(require("../services/ejs.service"));
const http_1 = require("../util/http");
const stream_1 = require("../util/stream");
const gotenberg_service_1 = require("../services/gotenberg.service");
class GenerateCertificateController {
    execute(orderId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Get  data
            const orderData = yield this.getOrderData(orderId);
            const contractData = yield this.getContractData(orderData === null || orderData === void 0 ? void 0 : orderData.contract);
            const patientData = yield this.getPatientData(orderData === null || orderData === void 0 ? void 0 : orderData.patientId);
            const annotations = yield this.getAnnotations(orderId);
            // 2. render templates
            const templates = yield this.renderTemplates({
                order: orderData,
                contract: contractData,
                patient: patientData,
                annotations,
            });
            // 3. Create
            const certificate = yield this.createPdf(templates);
            //4. Save  in files database
            // 5. Return file id
            return certificate;
        });
    }
    getOrderData(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http_1.couchHttp.get(`/general/${orderId}`);
            if (response.status !== 200) {
                throw new Error('Order not found');
            }
            return response.data;
        });
    }
    getContractData(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http_1.couchHttp.get(`/general/${contractId}`);
            if (response.status !== 200) {
                throw new Error('Contract not found');
            }
            return response.data;
        });
    }
    getPatientData(patientDataId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http_1.couchHttp.get(`/medical/${patientDataId}`);
            if (response.status !== 200) {
                throw new Error('Patient not found');
            }
            // get patient
            const patient = yield http_1.couchHttp.get(`/general/${response.data.patientId}`);
            return Object.assign(Object.assign({}, patient.data), response.data);
        });
    }
    getAnnotations(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http_1.couchHttp.post(`/general/_find`, {
                selector: {
                    docType: 'annotations',
                    orderId,
                },
            });
            if (response.status !== 200) {
                throw new Error('Annotations not found');
            }
            return response.data.docs;
        });
    }
    createPdf(templates) {
        return __awaiter(this, void 0, void 0, function* () {
            const gotenbergService = new gotenberg_service_1.GotenbergService();
            const pdf = yield gotenbergService.build(templates, {});
            return pdf;
        });
    }
    renderTemplates(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.getTemplates('INFORMED-CONSENT');
            const ejsService = new ejs_service_1.default();
            return {
                header: yield ejsService.renderFile(templates.header, data),
                index: yield ejsService.renderFile(templates.index, data),
                footer: yield ejsService.renderFile(templates.footer, data),
            };
        });
    }
    getTemplates(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // find template in database by code
            const response = yield http_1.couchHttp.post(`/general/_find`, {
                selector: {
                    docType: 'templates',
                    code,
                },
                fields: ['_id', 'code', 'header', 'body', 'footer'],
            });
            if (response.status !== 200) {
                throw new Error('Template not found');
            }
            const template = response.data.docs[0];
            return {
                header: template.header,
                index: template.body,
                footer: template.footer,
            };
        });
    }
    savePdf(orderId, certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            // save pdf in files database
            const fileInBase64 = yield (0, stream_1.streamToBase64)(certificate);
            const response = yield http_1.couchHttp.post(`/files/`, {
                docType: 'files',
                type: 'certificates',
                orderId,
                _attachments: {
                    certificate: {
                        content_type: 'application/pdf',
                        data: fileInBase64,
                    },
                },
                synced: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isDeleted: false,
            });
            // return file id
            return response.data.id;
        });
    }
}
exports.GenerateCertificateController = GenerateCertificateController;
//# sourceMappingURL=create-informed-consent.js.map