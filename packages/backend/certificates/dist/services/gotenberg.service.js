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
exports.GotenbergService = void 0;
const chromiumly_1 = require("chromiumly");
class GotenbergService {
    build(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlConverter = new chromiumly_1.HtmlConverter();
            const buffer = yield htmlConverter.convert({
                header: Buffer.from(data.header),
                html: Buffer.from(data.index),
                footer: Buffer.from(data.footer),
                properties: Object.assign({ printBackground: true }, data === null || data === void 0 ? void 0 : data.properties),
            });
            return buffer.toString('base64');
        });
    }
}
exports.GotenbergService = GotenbergService;
//# sourceMappingURL=gotenberg.service.js.map