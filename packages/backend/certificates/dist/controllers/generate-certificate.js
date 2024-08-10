"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCertificateController = void 0;
const ejs_service_1 = __importDefault(require("../services/ejs.service"));
const http_1 = require("../util/http");
const gotenberg_service_1 = require("../services/gotenberg.service");
class GenerateCertificateController {
    async execute(orderId, code) {
        console.log('Received request to generate certificate', orderId, code);
        try {
            const orderData = await this.getOrderData(orderId);
            console.log('orderData');
            const contractData = await this.getContractData(orderData === null || orderData === void 0 ? void 0 : orderData.contract);
            console.log('contractData');
            const patientData = await this.getPatientData(orderData === null || orderData === void 0 ? void 0 : orderData.patientDataId);
            console.log('patientData');
            const annotations = await this.getAnnotations(orderId);
            console.log('annotations', annotations);
            const templates = await this.renderTemplates({
                code,
                order: orderData,
                contract: contractData,
                patient: patientData,
                annotations,
            });
            console.log('templates');
            const certificate = await this.createPdf(templates);
            console.log('certificate');
            const id = await this.savePdf(orderId, certificate);
            return {
                id,
            };
        }
        catch (error) {
            console.log('Error generating certificate', error);
        }
        return null;
    }
    async getOrderData(orderId) {
        const response = await http_1.couchHttp.get(`/general/${orderId}`);
        if (response.status !== 200) {
            throw new Error('Order not found');
        }
        return response.data;
    }
    async getContractData(contractId) {
        const response = await http_1.couchHttp.get(`/general/${contractId}`);
        if (response.status !== 200) {
            throw new Error('Contract not found');
        }
        return response.data;
    }
    async getPatientData(patientDataId) {
        console.log('patientDataId', patientDataId);
        const response = await http_1.couchHttp.get(`/medical/${patientDataId}`);
        if (response.status !== 200) {
            throw new Error('Patient not found');
        }
        console.log('patientId', response.data.patientId);
        const patient = await http_1.couchHttp.get(`/medical/${response.data.patientId}`);
        return Object.assign(Object.assign({}, patient.data), response.data);
    }
    async getAnnotations(orderId) {
        const response = await http_1.couchHttp.post(`/medical/_find`, {
            selector: {
                doctype: 'annotations',
                orderId,
            },
        });
        if (response.status !== 200) {
            throw new Error('Annotations not found');
        }
        return response.data.docs;
    }
    async createPdf(templates) {
        const gotenbergService = new gotenberg_service_1.GotenbergService();
        const pdf = (await gotenbergService.build(templates));
        return pdf;
    }
    async renderTemplates(data) {
        const templates = await this.getTemplates(data.code);
        const ejsService = new ejs_service_1.default();
        return {
            header: await ejsService.renderFile(templates.header, data),
            index: await ejsService.renderFile(templates.index, data),
            footer: await ejsService.renderFile(templates.footer, data),
            properties: templates.properties,
        };
    }
    async getTemplates(code) {
        const response = await http_1.couchHttp.post(`/general/_find`, {
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
    }
    async savePdf(orderId, base64Certificate) {
        const response = await http_1.couchHttp.post(`/files/`, {
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
        return response.data.id;
    }
}
exports.GenerateCertificateController = GenerateCertificateController;
//# sourceMappingURL=generate-certificate.js.map