"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../core/request");
const helpers_1 = require("../helpers");
const _ = require('lodash');
const Resource = require('./resource');
const camelKeys = require('camelcase-keys');
class Hashtag extends Resource {
    static search(session, query) {
        return session
            .getAccountId()
            .then(id => {
            const rankToken = helpers_1.Helpers.buildRankToken(id);
            return new request_1.Request(session)
                .setMethod('GET')
                .setResource('hashtagsSearch', {
                query,
                rankToken,
            })
                .send();
        })
            .then(data => _.map(data.results, hashtag => new Hashtag(session, hashtag)));
    }
    static related(session, tag) {
        return new request_1.Request(session)
            .setMethod('GET')
            .setResource('hashtagsRelated', {
            tag,
            visited: `[{"id":"${tag}","type":"hashtag"}]`,
            related_types: '["hashtag"]',
        })
            .send()
            .then(data => _.map(data.related, hashtag => new Hashtag(session, hashtag)));
    }
    static info(session, tag) {
        return new request_1.Request(session)
            .setMethod('GET')
            .setResource('hashtagsInfo', {
            tag,
        })
            .send()
            .then(hashtag => new Hashtag(session, hashtag));
    }
    parseParams(json) {
        const hash = camelKeys(json);
        hash.mediaCount = parseInt(json.media_count);
        if (_.isObject(hash.id))
            hash.id = hash.id.toString();
        return hash;
    }
}
module.exports = Hashtag;
//# sourceMappingURL=hashtag.js.map