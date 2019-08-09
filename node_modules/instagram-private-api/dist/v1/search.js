"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const user_1 = require("../models/user");
const request_1 = require("../core/request");
const helpers_1 = require("../helpers");
const Hashtag = require('./hashtag');
const Location = require('./location');
module.exports = (session, query) => session
    .getAccountId()
    .then(id => new request_1.Request(session)
    .setMethod('GET')
    .setResource('topSearch', {
    rankToken: helpers_1.Helpers.buildRankToken(id).toUpperCase(),
    query,
})
    .send())
    .then(json => {
    const users = json.users.map(user => ({
        user: class_transformer_1.plainToClass(user_1.User, user.user),
        position: user.position,
    }));
    const places = json.places.map(place => ({
        place: new Location(session, place.place),
        position: place.position,
    }));
    const hashtags = json.hashtags.map(hashtag => ({
        hashtag: new Hashtag(session, hashtag.hashtag),
        position: hashtag.position,
    }));
    return {
        users,
        places,
        hashtags,
    };
});
//# sourceMappingURL=search.js.map