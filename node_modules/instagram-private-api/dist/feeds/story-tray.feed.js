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
const constants_1 = require("../constants/constants");
const story_tray_1 = require("../models/story-tray");
const class_transformer_1 = require("class-transformer");
const request_1 = require("../core/request");
class StoryTrayFeed {
    constructor(session) {
        this.session = session;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tray } = yield new request_1.Request(this.session)
                .setMethod('POST')
                .setResource('storyTray')
                .setBodyType('form')
                .setData({})
                .setData({
                _uuid: this.session.uuid,
                _csrftoken: this.session.CSRFToken,
                supported_capabilities_new: JSON.stringify(constants_1.SUPPORTED_CAPABILITIES),
            })
                .send();
            return class_transformer_1.plainToClass(story_tray_1.StoryTray, tray);
        });
    }
}
exports.StoryTrayFeed = StoryTrayFeed;
//# sourceMappingURL=story-tray.feed.js.map