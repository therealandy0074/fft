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
const errors = require('request-promise/errors');
const Promise = require('bluebird');
const { WebRequest } = require('../core/web-request');
const { Request } = require('../core/request');
const Exceptions = require('../core/exceptions');
const SHARED_JSON_REGEXP = /window._sharedData = (.*);<\/script>/i;
class Challenge {
    constructor(session, type, error, json) {
        this._json = json;
        this._session = session;
        this._type = type;
        this._error = error;
        this.apiUrl = error.apiUrl;
    }
    get type() {
        return this._type;
    }
    set type(val) { }
    get session() {
        return this._session;
    }
    set session(val) { }
    get error() {
        return this._error;
    }
    set error(val) { }
    get json() {
        return this._json;
    }
    set json(val) { }
    static handleResponse(response, checkpointError, defaultMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = checkpointError.session;
            let json;
            try {
                json = JSON.parse(response.body);
            }
            catch (e) {
                if (response.body.includes('url=instagram://checkpoint/dismiss'))
                    throw new Exceptions.NoChallengeRequired();
                throw new TypeError('Invalid response. JSON expected');
            }
            if (json.challenge && json.challenge.native_flow === false)
                return this.resolveHtml(checkpointError, defaultMethod);
            if (json.status === 'ok' && json.action === 'close')
                throw new Exceptions.NoChallengeRequired();
            const apiChallengeUrl = `https://i.instagram.com/api/v1${checkpointError.json.challenge.api_path}`;
            switch (json.step_name) {
                case 'select_verify_method': {
                    const selectResponse = yield new WebRequest(session)
                        .setMethod('POST')
                        .setUrl(apiChallengeUrl)
                        .setData({
                        choice: json.step_data.choice,
                    })
                        .send({ followRedirect: true });
                    return this.handleResponse(selectResponse, checkpointError, defaultMethod);
                }
                case 'verify_code':
                case 'submit_phone':
                    return new PhoneVerificationChallenge(session, 'phone', checkpointError, json);
                case 'verify_email':
                    return new EmailVerificationChallenge(session, 'email', checkpointError, json);
                case 'delta_login_review':
                    const deltaLoginResponse = yield new WebRequest(session)
                        .setMethod('POST')
                        .setUrl(apiChallengeUrl)
                        .setData({
                        choice: 0,
                    })
                        .send({ followRedirect: true });
                    return this.handleResponse(deltaLoginResponse, checkpointError, defaultMethod);
                default:
                    return new NotImplementedChallenge(session, json.step_name, checkpointError, json);
            }
        });
    }
    static resolve(checkpointError, defaultMethod, skipResetStep) {
        return __awaiter(this, void 0, void 0, function* () {
            checkpointError = checkpointError instanceof Exceptions.CheckpointError ? checkpointError : checkpointError.json;
            if (typeof defaultMethod === 'undefined')
                defaultMethod = 'email';
            if (!(checkpointError instanceof Exceptions.CheckpointError))
                throw new Error('`Challenge.resolve` method must get exception (type of `CheckpointError`) as a first argument');
            if (!['email', 'phone'].includes(defaultMethod))
                throw new Error('Invalid default method');
            const session = checkpointError.session;
            const response = yield Promise.try(() => __awaiter(this, void 0, void 0, function* () {
                if (skipResetStep)
                    return new WebRequest(session)
                        .setMethod('GET')
                        .setUrl(`https://i.instagram.com/api/v1${checkpointError.json.challenge.api_path}`)
                        .send({ followRedirect: true });
                return {
                    body: JSON.stringify(yield this.reset(checkpointError)),
                };
            })).catch(errors.StatusCodeError, error => error.response);
            return this.handleResponse(response, checkpointError, defaultMethod);
        });
    }
    static resolveHtml(checkpointError, defaultMethod) {
        const that = this;
        if (!(checkpointError instanceof Exceptions.CheckpointError))
            throw new Error('`Challenge.resolve` method must get exception (type of `CheckpointError`) as a first argument');
        if (!['email', 'phone'].includes(defaultMethod))
            throw new Error('Invalid default method');
        const session = checkpointError.session;
        return new WebRequest(session)
            .setMethod('GET')
            .setUrl(checkpointError.url)
            .setHeaders({
            Referer: checkpointError.url,
        })
            .send({ followRedirect: true })
            .catch(errors.StatusCodeError, error => error.response)
            .then(parseResponse);
        function parseResponse(response) {
            let choice;
            let challenge;
            let json;
            try {
                if (response.headers['content-type'] === 'application/json') {
                    json = JSON.parse(response.body);
                    challenge = json;
                }
                else {
                    json = JSON.parse(SHARED_JSON_REGEXP.exec(response.body)[1]);
                    challenge = json.entry_data.Challenge[0];
                }
            }
            catch (e) {
                throw new TypeError('Invalid response. JSON expected');
            }
            if (defaultMethod === 'email') {
                choice = challenge.fields.email ? 1 : 0;
            }
            else if (defaultMethod === 'phone') {
                choice = challenge.fields.phone_number ? 0 : 1;
            }
            switch (challenge.challengeType) {
                case 'SelectVerificationMethodForm': {
                    return new WebRequest(session)
                        .setMethod('POST')
                        .setUrl(checkpointError.url)
                        .setHeaders({
                        Referer: checkpointError.url,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Instagram-AJAX': 1,
                    })
                        .setData({
                        choice,
                    })
                        .send({ followRedirect: true })
                        .then(() => that.resolveHtml(checkpointError, defaultMethod));
                }
                case 'VerifyEmailCodeForm':
                    return new EmailVerificationChallenge(session, 'email', checkpointError, json);
                case 'VerifySMSCodeForm':
                    return new PhoneVerificationChallenge(session, 'phone', checkpointError, json);
                default:
                    return new NotImplementedChallenge(session, challenge.challengeType, checkpointError, json);
            }
        }
    }
    static reset(checkpointError) {
        const session = checkpointError.session;
        return new Request(session)
            .setMethod('POST')
            .setBodyType('form')
            .setUrl(checkpointError.apiUrl.replace('/challenge/', '/challenge/reset/'))
            .signPayload()
            .send({ followRedirect: true })
            .catch(error => error.response);
    }
    code(code) {
        const that = this;
        if (!code || code.length !== 6)
            throw new Error('Invalid code provided');
        return new WebRequest(that.session)
            .setMethod('POST')
            .setUrl(that.apiUrl)
            .setBodyType('form')
            .setData({
            security_code: code,
        })
            .send({ followRedirect: false })
            .then(response => {
            let json;
            try {
                json = JSON.parse(response.body);
            }
            catch (e) {
                throw new TypeError('Invalid response. JSON expected');
            }
            if (response.statusCode === 200 &&
                json.status === 'ok' &&
                (json.action === 'close' || json.location === 'instagram://checkpoint/dismiss'))
                return true;
            throw new Exceptions.NotPossibleToResolveChallenge('Unknown error', Exceptions.NotPossibleToResolveChallenge.CODE.UNKNOWN);
        })
            .catch(errors.StatusCodeError, error => {
            if (error.statusCode === 400)
                throw new Exceptions.NotPossibleToResolveChallenge('Verification has not been accepted', Exceptions.NotPossibleToResolveChallenge.CODE.NOT_ACCEPTED);
            throw error;
        });
    }
}
exports.Challenge = Challenge;
class PhoneVerificationChallenge extends Challenge {
    constructor(session, type, checkpointError, json) {
        super(...arguments);
        this.submitPhone = json.step_name === 'submit_phone';
    }
    phone(phone) {
        const that = this;
        if (!this.submitPhone)
            return Promise.resolve(this);
        let instaPhone = that.json && that.json.step_data ? that.json.step_data.phone_number : null;
        let _phone = phone || instaPhone;
        if (!_phone)
            return new Error('Invalid phone number');
        console.log(`Requesting phone`);
        return new WebRequest(that.session)
            .setMethod('POST')
            .setUrl(that.apiUrl)
            .setBodyType('form')
            .setData({
            phone_number: _phone,
        })
            .removeHeader('x-csrftoken')
            .send({ followRedirect: false })
            .then(response => {
            let json;
            try {
                json = JSON.parse(response.body);
            }
            catch (e) {
                throw new TypeError('Invalid response. JSON expected');
            }
            return new PhoneVerificationChallenge(that.session, 'phone', that.error, json);
        });
    }
}
exports.PhoneVerificationChallenge = PhoneVerificationChallenge;
class EmailVerificationChallenge extends Challenge {
}
exports.EmailVerificationChallenge = EmailVerificationChallenge;
class NotImplementedChallenge extends Challenge {
    constructor(session, challengeType) {
        super(...arguments);
        throw new Error(`Not implemented challenge type: "${challengeType}"`);
    }
}
exports.NotImplementedChallenge = NotImplementedChallenge;
//# sourceMappingURL=challenge.js.map