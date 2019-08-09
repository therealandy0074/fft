"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const user_1 = require("./user");
const media_1 = require("./media");
const location_1 = require("./location");
const abstract_model_1 = require("./abstract.model");
class StoryTray extends abstract_model_1.AbstractModel {
}
__decorate([
    class_transformer_1.Type(() => user_1.User),
    __metadata("design:type", user_1.User)
], StoryTray.prototype, "user", void 0);
__decorate([
    class_transformer_1.Type(() => location_1.Location),
    __metadata("design:type", location_1.Location)
], StoryTray.prototype, "location", void 0);
__decorate([
    class_transformer_1.Type(() => media_1.Media),
    __metadata("design:type", Array)
], StoryTray.prototype, "items", void 0);
exports.StoryTray = StoryTray;
//# sourceMappingURL=story-tray.js.map