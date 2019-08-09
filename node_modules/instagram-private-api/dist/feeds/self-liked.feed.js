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
const core_1 = require("../core");
const media_1 = require("../models/media");
class SelfLikedFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit) {
        super(session);
        this.limit = limit;
        this.limit = parseInt(limit) || null;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new core_1.Request(this.session)
                .setMethod('GET')
                .setResource('selfLikedFeed', {
                maxId: this.getCursor(),
            })
                .send();
            const nextMaxId = data.next_max_id ? data.next_max_id.toString() : data.next_max_id;
            this.moreAvailable = data.more_available && !!nextMaxId;
            if (this.moreAvailable)
                this.setCursor(nextMaxId);
            return class_transformer_1.plainToClass(media_1.Media, data.items);
        });
    }
}
exports.SelfLikedFeed = SelfLikedFeed;
//# sourceMappingURL=self-liked.feed.js.map