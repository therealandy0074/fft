"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelKeys = require("camelcase-keys");
const class_transformer_1 = require("class-transformer");
class AbstractModel {
    get params() {
        return camelKeys(class_transformer_1.classToPlain(this), { deep: true });
    }
}
exports.AbstractModel = AbstractModel;
//# sourceMappingURL=abstract.model.js.map