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
const abstract_feed_1 = require("./abstract.feed");
const request_1 = require("../core/request");
const class_transformer_1 = require("class-transformer");
const user_1 = require("../models/user");
class StoryViewersFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, mediaId) {
        super(session);
        this.mediaId = mediaId;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new request_1.Request(this.session)
                .setMethod('GET')
                .setResource('storyViewers', {
                mediaId: this.mediaId,
                maxId: this.getCursor(),
            })
                .send();
            const nextMaxId = data.next_max_id ? data.next_max_id.toString() : data.next_max_id;
            this.moreAvailable = !!nextMaxId;
            if (this.moreAvailable)
                this.setCursor(nextMaxId);
            return class_transformer_1.plainToClass(user_1.User, data.users);
        });
    }
}
exports.StoryViewersFeed = StoryViewersFeed;
//# sourceMappingURL=story-viewers.feed.js.map