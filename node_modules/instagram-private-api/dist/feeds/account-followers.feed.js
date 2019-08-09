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
const class_transformer_1 = require("class-transformer");
const user_1 = require("../models/user");
const abstract_feed_1 = require("./abstract.feed");
class AccountFollowersFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, accountId, limit = Infinity) {
        super(session);
        this.accountId = accountId;
        this.limit = limit;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new request_1.Request(this.session)
                .setMethod('GET')
                .setResource('followersFeed', {
                id: this.accountId,
                maxId: this.cursor,
                rankToken: this.rankToken,
            })
                .send();
            this.moreAvailable = !!data.next_max_id;
            if (this.moreAvailable) {
                this.setCursor(data.next_max_id);
            }
            return class_transformer_1.plainToClass(user_1.User, data.users);
        });
    }
}
exports.AccountFollowersFeed = AccountFollowersFeed;
//# sourceMappingURL=account-followers.feed.js.map