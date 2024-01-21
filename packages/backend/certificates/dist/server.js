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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const generate_certificate_1 = require("./controllers/generate-certificate");
const get_file_1 = require("./controllers/get-file");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use((0, morgan_1.default)('combined'));
const port = process.env.PORT || 3000;
app.post('/api/certificates/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received request to generate certificate', req.body);
    const certificateId = yield new generate_certificate_1.GenerateCertificateController().execute(req.body.order, req.body.code);
    res.send(certificateId);
    res.end();
}));
app.get('/api/files/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received request to get file', req.params.id);
    const certificate = yield new get_file_1.GetFileController().execute(req.params.id);
    res.setHeader('Content-Disposition', `inline; filename=${certificate.fileName}`);
    // get file type from file name
    res.setHeader('Content-Type', certificate.fileType);
    res.send(certificate.data);
    res.end();
}));
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map