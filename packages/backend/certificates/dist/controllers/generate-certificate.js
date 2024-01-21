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
const gotenberg_service_1 = require("../services/gotenberg.service");
class GenerateCertificateController {
    execute(orderId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Received request to generate certificate', orderId, code);
            try {
                // 1. Get  data
                const orderData = yield this.getOrderData(orderId);
                console.log('orderData');
                const contractData = yield this.getContractData(orderData === null || orderData === void 0 ? void 0 : orderData.contract);
                console.log('contractData');
                const patientData = yield this.getPatientData(orderData === null || orderData === void 0 ? void 0 : orderData.patientDataId);
                console.log('patientData');
                const annotations = yield this.getAnnotations(orderId);
                console.log('annotations');
                // 2. render templates
                const templates = yield this.renderTemplates({
                    order: orderData,
                    contract: contractData,
                    patient: patientData,
                    annotations,
                });
                console.log('templates');
                // 3. Create
                const certificate = yield this.createPdf(templates);
                console.log('certificate');
                //4. Save  in files database
                const id = yield this.savePdf(orderId, certificate);
                // 5. Return file id
                return {
                    id,
                };
            }
            catch (error) {
                console.log('Error generating certificate', error);
            }
            return null;
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
            console.log('patientDataId', patientDataId);
            const response = yield http_1.couchHttp.get(`/medical/${patientDataId}`);
            if (response.status !== 200) {
                throw new Error('Patient not found');
            }
            console.log('patientId', response.data.patientId);
            // get patient
            const patient = yield http_1.couchHttp.get(`/medical/${response.data.patientId}`);
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
            const pdf = yield gotenbergService.build(templates);
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
                properties: templates.properties,
            };
        });
    }
    getTemplates(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // find template in database by code
            const response = yield http_1.couchHttp.post(`/general/_find`, {
                selector: {
                    doctype: 'templates',
                    code,
                },
                fields: ['_id', 'code', 'header', 'body', 'footer', 'props'],
            });
            if (response.status !== 200) {
                throw new Error('Template not found');
            }
            const template = response.data.docs[0];
            return {
                header: template.header,
                index: template.body,
                footer: template.footer,
                properties: template.props,
            };
        });
    }
    savePdf(orderId, base64Certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            // save pdf in files database
            const response = yield http_1.couchHttp.post(`/files/`, {
                docType: 'files',
                type: 'certificates',
                orderId,
                _attachments: {
                    'certificate.pdf': {
                        content_type: 'application/pdf',
                        data: base64Certificate,
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
//# sourceMappingURL=generate-certificate.js.map