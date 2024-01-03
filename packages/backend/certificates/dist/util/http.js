"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couchHttp = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
exports.couchHttp = axios_1.default.create({
    baseURL: (0, config_1.default)().DB.URL,
    auth: {
        username: (0, config_1.default)().DB.USERNAME,
        password: (0, config_1.default)().DB.PASSWORD,
    },
    headers: {
        'Content-Type': 'application/json',
    },
});
//# sourceMappingURL=http.js.map