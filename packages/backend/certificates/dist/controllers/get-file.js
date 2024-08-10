"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFileController = void 0;
const http_1 = require("../util/http");
class GetFileController {
    async execute(fileId) {
        try {
            const response = await http_1.couchHttp.get(`/files/${fileId}`);
            if (response.status !== 200) {
                throw new Error('File not found');
            }
            if (!response.data) {
                throw new Error('File not found');
            }
            if (response.data.url) {
                const file = await http_1.couchHttp.get(response.data.url, {
                    responseType: 'arraybuffer',
                });
                if (file.status !== 200) {
                    throw new Error('File not found');
                }
                return {
                    fileName: '',
                    data: file.data,
                };
            }
            const fileName = response.data._attachments && Object.keys(response.data._attachments)[0];
            const fileType = response.data._attachments[fileName].content_type;
            const file = await http_1.couchHttp.get(`/files/${fileId}/${fileName}`, {
                responseType: 'arraybuffer',
            });
            if (file.status !== 200) {
                throw new Error('File not found');
            }
            return {
                fileName,
                fileType,
                data: file.data,
            };
        }
        catch (error) {
            console.log('Error retrieving file', error);
        }
        return null;
    }
}
exports.GetFileController = GetFileController;
//# sourceMappingURL=get-file.js.map