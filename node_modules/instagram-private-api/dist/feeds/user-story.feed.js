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
const media_1 = require("../models/media");
const class_transformer_1 = require("class-transformer");
class UserStoryFeed {
    constructor(session, userIds) {
        this.session = session;
        this.userIds = userIds;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new core_1.Request(this.session)
                .setMethod('POST')
                .setResource('userStory')
                .generateUUID()
                .setData({
                user_ids: this.userIds.map(id => String(id)),
            })
                .signPayload()
                .send();
            return class_transformer_1.plainToClass(media_1.Media, data.reels);
        });
    }
}
exports.UserStoryFeed = UserStoryFeed;
//# sourceMappingURL=user-story.feed.js.map