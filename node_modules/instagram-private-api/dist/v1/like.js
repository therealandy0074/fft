"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../core/request");
class Like {
    static post(action = 'like', session, mediaId, moduleInfo = { moduleName: 'feed_timeline', d: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new request_1.Request(session)
                .setMethod('POST')
                .setResource(action, { id: mediaId })
                .generateUUID()
                .setData(Object.assign({ media_id: mediaId, _uid: yield session.getAccountId(), radio_type: 'wifi-none' }, moduleInfo))
                .signPayload()
                .send();
        });
    }
    static create(session, mediaId, moduleName) {
        return this.post('like', session, mediaId, moduleName);
    }
    static destroy(session, mediaId, moduleName) {
        return this.post('unlike', session, mediaId, moduleName);
    }
}
exports.Like = Like;
//# sourceMappingURL=like.js.map