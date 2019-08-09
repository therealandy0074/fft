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
const _ = require("lodash");
const class_transformer_1 = require("class-transformer");
const abstract_feed_1 = require("./abstract.feed");
const media_1 = require("../models/media");
const request_1 = require("../core/request");
const exceptions_1 = require("../core/exceptions");
class TaggedMediaFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, tag, limit = Infinity) {
        super(session);
        this.tag = tag;
        this.limit = limit;
    }
    getRawResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new request_1.Request(this.session)
                .setMethod('GET')
                .setResource('tagFeed', {
                tag: this.tag,
                maxId: this.getCursor(),
                rankToken: this.rankToken,
            })
                .send();
            this.moreAvailable = data.more_available && !!data.next_max_id;
            if (this.moreAvailable)
                this.setCursor(data.next_max_id);
            return data;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getRawResponse();
            if (!this.moreAvailable && !_.isEmpty(data.ranked_items) && !this.getCursor())
                throw new exceptions_1.OnlyRankedItemsError();
            return class_transformer_1.plainToClass(media_1.Media, data.items);
        });
    }
    getRankedItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getRawResponse();
            return class_transformer_1.plainToClass(media_1.Media, data.ranked_items);
        });
    }
}
exports.TaggedMediaFeed = TaggedMediaFeed;
//# sourceMappingURL=tagged-media.feed.js.map