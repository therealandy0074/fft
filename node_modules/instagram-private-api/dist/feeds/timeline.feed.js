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
const abstract_feed_1 = require("./abstract.feed");
const request_1 = require("../core/request");
class TimelineFeed extends abstract_feed_1.AbstractFeed {
    constructor(session, limit = Infinity) {
        super(session);
        this.limit = limit;
    }
    get({ is_pull_to_refresh = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            const max_id = this.getCursor();
            let extra = {
                is_pull_to_refresh: '0',
            };
            if (max_id) {
                Object.assign(extra, {
                    max_id,
                    reason: 'pagination',
                });
            }
            else if (is_pull_to_refresh === true) {
                Object.assign(extra, {
                    reason: 'pull_to_refresh',
                    is_pull_to_refresh: '1',
                });
            }
            else if (is_pull_to_refresh === false) {
                Object.assign(extra, {
                    reason: 'warm_start_fetch',
                });
            }
            else {
                Object.assign(extra, {
                    reason: 'cold_start_fetch',
                });
            }
            const data = yield new request_1.Request(this.session)
                .setMethod('POST')
                .setResource('timelineFeed')
                .setHeaders({
                'X-Ads-Opt-Out': '0',
                'X-Google-AD-ID': this.session.device.adid,
                'X-DEVICE-ID': this.session.device.uuid,
            })
                .setBodyType('form')
                .generateUUID()
                .setData(Object.assign({ is_prefetch: '0', feed_view_info: '', seen_posts: '', unseen_posts: '', phone_id: this.session.device.phoneId, client_session_id: this.session.session_id, battery_level: '100', is_charging: '1', will_sound_on: '1', is_on_screen: true, timezone_offset: '2', is_async_ads_rti: '0', is_async_ads: '0', is_async_ads_double_request: '0', rti_delivery_backend: '0' }, extra))
                .send();
            this.moreAvailable = data.more_available;
            const medias = data.feed_items.filter(m => m.media_or_ad).map(m => m.media_or_ad);
            if (this.moreAvailable)
                this.setCursor(data.next_max_id);
            return class_transformer_1.plainToClass(media_1.Media, medias);
        });
    }
}
exports.TimelineFeed = TimelineFeed;
//# sourceMappingURL=timeline.feed.js.map