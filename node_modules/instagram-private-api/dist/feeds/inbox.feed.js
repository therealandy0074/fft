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
const core_1 = require("../core");
const abstract_feed_1 = require("./abstract.feed");
const Thread = require('../v1/thread');
class InboxFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit = Infinity) {
        super(session);
        this.limit = limit;
    }
    getPendingRequestsTotal() {
        return this.pendingRequestsTotal;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield new core_1.Request(this.session)
                .setMethod('GET')
                .setResource('inbox', {
                cursor: this.getCursor(),
            })
                .send();
            this.moreAvailable = json.inbox.has_older;
            this.pendingRequestsTotal = json.pending_requests_total;
            if (this.moreAvailable)
                this.setCursor(json.inbox.oldest_cursor.toString());
            return json.inbox.threads.map(thread => new Thread(this.session, thread));
        });
    }
}
exports.InboxFeed = InboxFeed;
//# sourceMappingURL=inbox.feed.js.map