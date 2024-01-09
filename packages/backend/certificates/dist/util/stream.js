"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToStream = exports.streamToBase64 = void 0;
const stream_1 = require("stream");
function streamToBase64(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    });
}
exports.streamToBase64 = streamToBase64;
function stringToStream(str) {
    return stream_1.Readable.from(str);
}
exports.stringToStream = stringToStream;
//# sourceMappingURL=stream.js.map