"use strict";
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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use((0, morgan_1.default)('combined'));
const port = process.env.PORT || 3000;
app.post('/api/certificates/', async (req, res) => {
    console.log('Received request to generate certificate', req.body);
    const certificateId = await new generate_certificate_1.GenerateCertificateController().execute(req.body.order, req.body.code);
    res.send(certificateId);
    res.end();
});
app.get('/api/files/:id', async (req, res) => {
    console.log('Received request to get file', req.params.id);
    const certificate = await new get_file_1.GetFileController().execute(req.params.id);
    res.setHeader('Content-Disposition', `inline; filename=${certificate.fileName}`);
    res.setHeader('Content-Type', certificate.fileType);
    res.send(certificate.data);
    res.end();
});
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map