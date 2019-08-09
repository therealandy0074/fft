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
const _ = require("lodash");
const class_transformer_1 = require("class-transformer");
const user_1 = require("../models/user");
const core_1 = require("../core");
const helpers_1 = require("../helpers");
class Account {
    static getById(session, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new core_1.Request(session)
                .setMethod('GET')
                .setResource('userInfo', { id })
                .send();
            return class_transformer_1.plainToClass(user_1.User, data.user);
        });
    }
    static search(session, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = yield session.getAccountId();
            const rankToken = helpers_1.Helpers.buildRankToken(uid);
            const data = yield new core_1.Request(session)
                .setMethod('GET')
                .setResource('accountsSearch', {
                query: username,
                rankToken,
            })
                .send();
            return class_transformer_1.plainToClass(user_1.User, data.users);
        });
    }
    static searchForUser(session, username) {
        return __awaiter(this, void 0, void 0, function* () {
            username = username.toLowerCase();
            const accounts = yield Account.search(session, username);
            const account = accounts.find(account => account.username === username);
            if (!account)
                throw new core_1.IGAccountNotFoundError();
            return account;
        });
    }
    static setProfilePicture(session, streamOrPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = helpers_1.Helpers.pathToStream(streamOrPath);
            const request = new core_1.Request(session);
            const data = yield request
                .setMethod('POST')
                .setResource('changeProfilePicture')
                .generateUUID()
                .signPayload()
                .transform(opts => {
                opts.formData.profile_pic = {
                    value: stream,
                    options: {
                        filename: 'profile_pic',
                        contentType: 'image/jpeg',
                    },
                };
                return opts;
            })
                .send();
            return class_transformer_1.plainToClass(user_1.User, data.user);
        });
    }
    static setPrivacy(session, pri) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new core_1.Request(session)
                .setMethod('POST')
                .setResource(pri ? 'setAccountPrivate' : 'setAccountPublic')
                .generateUUID()
                .signPayload()
                .send();
            return class_transformer_1.plainToClass(user_1.User, data.user);
        });
    }
    static editProfile(session, settings) {
        settings = _.isObject(settings) ? settings : {};
        if (_.isString(settings.phoneNumber))
            settings.phone_number = settings.phoneNumber;
        if (_.isString(settings.fullName))
            settings.first_name = settings.fullName;
        if (_.isString(settings.externalUrl))
            settings.external_url = settings.externalUrl;
        const pickData = o => _.pick(o, 'gender', 'biography', 'phone_number', 'first_name', 'external_url', 'username', 'email');
        return new core_1.Request(session)
            .setMethod('GET')
            .setResource('currentAccount')
            .send()
            .then(json => new core_1.Request(session)
            .setMethod('POST')
            .setResource('editAccount')
            .generateUUID()
            .setData(pickData(_.extend(json.user, settings)))
            .signPayload()
            .send())
            .then(json => {
            const account = class_transformer_1.plainToClass(user_1.User, json.user);
            return this.getById(session, account.id);
        })
            .catch(e => {
            if (e && e.json && e.json.message && _.isArray(e.json.message.errors)) {
                throw new core_1.RequestError({
                    message: e.json.message.errors.join('. '),
                });
            }
            throw e;
        });
    }
    static showProfile(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new core_1.Request(session)
                .setMethod('GET')
                .setResource('currentAccount')
                .send();
            return class_transformer_1.plainToClass(user_1.User, data.user);
        });
    }
}
exports.Account = Account;
//# sourceMappingURL=account.js.map