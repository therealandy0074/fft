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
const comment_1 = require("../models/comment");
class MediaCommentsFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, mediaId) {
        super(session);
        this.mediaId = mediaId;
        this.cursorType = 'minId';
    }
    setCursor(cursor) {
        this.cursor = encodeURIComponent(cursor);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = { mediaId: this.mediaId };
            resource[this.cursorType] = this.getCursor();
            this.cursorType === 'minId' ? (resource['maxId'] = null) : (resource['minId'] = null);
            const data = yield new core_1.Request(this.session)
                .setMethod('GET')
                .setResource('mediaComments', resource)
                .send()
                .catch(reason => {
                if (reason.json.message === 'Media is unavailable')
                    throw new core_1.MediaUnavailableError();
                else
                    throw reason;
            });
            data.next_max_id ? (this.cursorType = 'maxId') : (this.cursorType = 'minId');
            this.cursorType === 'minId'
                ? (this.moreAvailable = data.has_more_headload_comments && !!data.next_min_id)
                : (this.moreAvailable = data.has_more_comments && !!data.next_max_id);
            this.iteration = this.iteration++;
            if (this.moreAvailable) {
                this.cursorType === 'minId' ? this.setCursor(data.next_min_id) : this.setCursor(data.next_max_id);
            }
            return class_transformer_1.plainToClass(comment_1.Comment, data.comments);
        });
    }
}
exports.MediaCommentsFeed = MediaCommentsFeed;
//# sourceMappingURL=media-comments.feed.js.map