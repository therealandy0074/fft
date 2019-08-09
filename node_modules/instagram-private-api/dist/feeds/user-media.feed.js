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
const media_1 = require("../models/media");
const class_transformer_1 = require("class-transformer");
const core_1 = require("../core");
const abstract_feed_1 = require("./abstract.feed");
class UserMediaFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, accountId, limit = Infinity) {
        super(session);
        this.accountId = accountId;
        this.limit = limit;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new core_1.Request(this.session)
                .setMethod('GET')
                .setResource('userFeed', {
                id: this.accountId,
                maxId: this.getCursor(),
            })
                .send();
            this.moreAvailable = data.more_available && !!data.next_max_id;
            if (this.moreAvailable) {
                this.setCursor(data.next_max_id);
            }
            return class_transformer_1.plainToClass(media_1.Media, data.items);
        });
    }
}
exports.UserMediaFeed = UserMediaFeed;
//# sourceMappingURL=user-media.feed.js.map