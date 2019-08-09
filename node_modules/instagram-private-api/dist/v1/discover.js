"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const user_1 = require("../models/user");
const request_1 = require("../core/request");
const helpers_1 = require("../helpers");
const _ = require('lodash');
module.exports = (session, inSingup) => new request_1.Request(session)
    .setMethod('POST')
    .setResource('discoverAyml')
    .generateUUID()
    .setData({
    phone_id: helpers_1.Helpers.generateUUID(),
    in_signup: inSingup ? 'true' : 'false',
    module: 'discover_people',
})
    .send()
    .then(json => {
    const items = _.property('suggested_users.suggestions')(json) || [];
    return _.map(items, item => ({
        account: class_transformer_1.plainToClass(user_1.User, item.user),
        mediaIds: item.media_ids,
    }));
});
//# sourceMappingURL=discover.js.map