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
exports.GetFileController = void 0;
const http_1 = require("../util/http");
class GetFileController {
    execute(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Get  file from database
                const response = yield http_1.couchHttp.get(`/files/${fileId}`);
                if (response.status !== 200) {
                    throw new Error('File not found');
                }
                if (!response.data) {
                    throw new Error('File not found');
                }
                if (response.data.url) {
                    // get from url
                    const file = yield http_1.couchHttp.get(response.data.url, {
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
                // get from attachments
                const fileName = response.data._attachments && Object.keys(response.data._attachments)[0]; // get first attachment
                const fileType = response.data._attachments[fileName].content_type;
                const file = yield http_1.couchHttp.get(`/files/${fileId}/${fileName}`, {
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
                console.log('Error generating certificate', error);
            }
            return null;
        });
    }
}
exports.GetFileController = GetFileController;
//# sourceMappingURL=get-file.js.map