"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
class EjsService {
    renderFile(template, data) {
        return ejs_1.default.render(template, data, { async: true });
    }
}
exports.default = EjsService;
//# sourceMappingURL=ejs.service.js.map