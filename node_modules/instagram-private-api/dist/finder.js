'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let USERNAMETOFIND;
let COMMENTTOFIND;
const Client = require('./v1');
const path = require('path');
const { urlSegmentToInstagramId } = require('instagram-id-to-url-segment');
let MediaComments;
function main(usernameToFind, commentToFind, postUrl) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        USERNAMETOFIND = usernameToFind;
        COMMENTTOFIND = commentToFind;
        const Storage = new Client.CookieFileStorage(path.join(__dirname, '/cookies/test.json'));
        const Device = new Client.Device('test');
        const session = yield Client.Session.create(Device, Storage, 'enp_memes', 'ks82jsh87', null);
        let mediaId;
        const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        if (postUrl.match(re)) {
            mediaId = postUrl.split('/')[4];
            mediaId = urlSegmentToInstagramId(mediaId);
        }
        else
            return reject(new Error('Not a valid uri'));
        MediaComments = new Client.Feed.MediaComments(session, mediaId);
        loop(id => {
            if (id instanceof Error)
                reject(id);
            else
                resolve(id);
        });
    }));
}
function loop(cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const Comments = yield get();
        if (!Comments) {
            cb(new Error('Could not find desired comment'));
        }
        const result = process(Comments);
        if (result) {
            return cb(result);
        }
        setTimeout(loop, 5000, cb);
    });
}
function get() {
    return __awaiter(this, void 0, void 0, function* () {
        if (MediaComments.iteration == 0) {
            return yield MediaComments.get();
        }
        else if (MediaComments.moreAvailable) {
            return yield MediaComments.get();
        }
        else {
            return false;
        }
    });
}
function process(Comments) {
    for (let idx = 0; idx < Comments.length; idx++) {
        if (Comments[idx]._params.user.username == USERNAMETOFIND) {
            if (Comments[idx]._params.text == COMMENTTOFIND) {
                return Comments[idx].id;
            }
        }
    }
    return false;
}
module.exports = main;
//# sourceMappingURL=finder.js.map