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
const class_transformer_1 = require("class-transformer");
const abstract_feed_1 = require("./abstract.feed");
const media_1 = require("../models/media");
const request_1 = require("../core/request");
class SavedMediaFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit) {
        super(session);
        this.limit = limit;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new request_1.Request(this.session)
                .setMethod('POST')
                .setResource('savedFeed', {
                maxId: this.cursor,
            })
                .generateUUID()
                .setData({})
                .signPayload()
                .send();
            this.moreAvailable = data.more_available;
            if (this.moreAvailable && data.next_max_id) {
                this.setCursor(data.next_max_id);
            }
            return class_transformer_1.plainToClass(media_1.Media, data.items.map(i => i.media));
        });
    }
}
exports.SavedMediaFeed = SavedMediaFeed;
//# sourceMappingURL=saved-media.feed.js.map