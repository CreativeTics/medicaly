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
const node_cron_1 = require("node-cron");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const config_1 = require("./config");
const sync_general_1 = require("./services/sync-general");
const sync_medical_1 = require("./services/sync-medical");
const CronJobExpression = (0, config_1.default)().CRON_EXPRESSION;
(0, node_cron_1.schedule)(CronJobExpression, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Cron job started ... at ${CronJobExpression}`);
    (0, sync_general_1.syncGeneral)();
    (0, sync_medical_1.syncMedical)();
}));
console.log(`Cron job started ... at ${CronJobExpression}`);
//# sourceMappingURL=index.js.map