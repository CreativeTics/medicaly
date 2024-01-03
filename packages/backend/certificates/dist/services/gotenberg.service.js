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
exports.GotenbergService = void 0;
const gotenberg_js_client_1 = require("gotenberg-js-client");
const config_1 = __importDefault(require("../config"));
class GotenbergService {
    build(data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const toPDF = (0, gotenberg_js_client_1.pipe)((0, gotenberg_js_client_1.gotenberg)((0, config_1.default)().API_GOTENBERG), gotenberg_js_client_1.convert, gotenberg_js_client_1.html, (0, gotenberg_js_client_1.adjust)({
                fields: Object.assign({ printBackground: true, marginTop: 1, marginBottom: 1, marginLeft: 0.2, marginRight: 0.2 }, params),
            }), (0, gotenberg_js_client_1.set)({
                waitTimeout: 1000,
                googleChromeRpccBufferSize: 104857600,
            }), gotenberg_js_client_1.please);
            return yield toPDF({
                'index.html': data.index,
                'header.html': data.header,
                'footer.html': data.footer,
            });
        });
    }
}
exports.GotenbergService = GotenbergService;
//# sourceMappingURL=gotenberg.service.js.map