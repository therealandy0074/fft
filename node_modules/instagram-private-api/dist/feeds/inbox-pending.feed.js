"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_feed_1 = require("./abstract.feed");
const request_1 = require("../core/request");
const Thread = require('../v1/thread');
class InboxPendingFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit) {
        super(session);
        this.limit = parseInt(limit) || null;
        this.pendingRequestsTotal = null;
    }
    getPendingRequestsTotal() {
        return this.pendingRequestsTotal;
    }
    get() {
        const that = this;
        return new request_1.Request(this.session)
            .setMethod('GET')
            .setResource('inboxPending', {
            maxId: this.getCursor(),
        })
            .send()
            .then(json => {
            that.moreAvailable = json.inbox.has_older;
            that.pendingRequestsTotal = json.pending_requests_total;
            if (that.moreAvailable)
                that.setCursor(json.inbox.oldest_cursor.toString());
            return json.inbox.threads.map(thread => new Thread(that.session, thread));
        });
    }
}
exports.InboxPendingFeed = InboxPendingFeed;
//# sourceMappingURL=inbox-pending.feed.js.map