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
const Bluebird = require("bluebird");
const request_1 = require("./request");
const CONSTANTS = require("../constants/constants");
const routes = require("./routes");
const exceptions_1 = require("./exceptions");
class WebRequest extends request_1.Request {
    constructor(session) {
        super(session);
        this._jsonEndpoint = false;
        this._request.headers = _.extend(_.clone(this._request.headers), {
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
        });
        delete this._request.headers['X-IG-Connection-Type'];
        delete this._request.headers['X-IG-Capabilities'];
    }
    setResource(resource, data) {
        this._resource = resource;
        this.setUrl(routes.getWebUrl(resource, data));
        return this;
    }
    setDevice(device) {
        this._device = device;
        this.setHeaders({
            'User-Agent': device.userAgentWeb(),
        });
        return this;
    }
    setJSONEndpoint() {
        this.setOptions({
            qs: { __a: '1' },
        });
        this._jsonEndpoint = true;
        return this;
    }
    setCSRFToken(token) {
        this.setHeaders({
            'x-csrftoken': token,
        });
        return this;
    }
    setHost(host) {
        if (!host)
            host = CONSTANTS.WEB_HOSTNAME;
        this.setHeaders({
            Host: host,
        });
        return this;
    }
    send(options) {
        return Bluebird.try(() => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendAndGetRaw(options);
            if (this._jsonEndpoint) {
                return this.parseMiddleware(response).body;
            }
            return response;
        })).catch(err => {
            if (!err || !err.response)
                throw err;
            const response = err.response;
            if (response.statusCode === 404)
                throw new exceptions_1.NotFoundError(response);
            throw err;
        });
    }
}
exports.WebRequest = WebRequest;
//# sourceMappingURL=web-request.js.map