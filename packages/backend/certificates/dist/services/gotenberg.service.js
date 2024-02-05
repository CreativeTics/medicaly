"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GotenbergService = void 0;
const chromiumly_1 = require("chromiumly");
class GotenbergService {
    async build(data) {
        const htmlConverter = new chromiumly_1.HtmlConverter();
        const buffer = await htmlConverter.convert({
            header: Buffer.from(data.header),
            html: Buffer.from(data.index),
            footer: Buffer.from(data.footer),
            properties: Object.assign({ printBackground: true }, data === null || data === void 0 ? void 0 : data.properties),
        });
        return buffer.toString('base64');
    }
}
exports.GotenbergService = GotenbergService;
//# sourceMappingURL=gotenberg.service.js.map