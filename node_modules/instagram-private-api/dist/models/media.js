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
const comment_1 = require("./comment");
const image_version_1 = require("./image-version");
const location_1 = require("./location");
const video_version_1 = require("./video-version");
const abstract_model_1 = require("./abstract.model");
class Media extends abstract_model_1.AbstractModel {
    get webLink() {
        return `https://www.instagram.com/p/${this.code}/`;
    }
    get account() {
        return this.user;
    }
    get takenAt() {
        return this.taken_at * 1000;
    }
    get images() {
        return this.image_versions2;
    }
    get videos() {
        return this.video_versions;
    }
}
__decorate([
    class_transformer_1.Type(() => comment_1.Comment),
    __metadata("design:type", Array)
], Media.prototype, "preview_comments", void 0);
__decorate([
    class_transformer_1.Type(() => Media),
    __metadata("design:type", Array)
], Media.prototype, "carousel_media", void 0);
__decorate([
    class_transformer_1.Type(() => image_version_1.ImageVersion),
    class_transformer_1.Transform(image_versions2 => image_versions2.candidates, { toClassOnly: true }),
    __metadata("design:type", Array)
], Media.prototype, "image_versions2", void 0);
__decorate([
    class_transformer_1.Type(() => video_version_1.VideoVersion),
    __metadata("design:type", Array)
], Media.prototype, "video_versions", void 0);
__decorate([
    class_transformer_1.Type(() => location_1.Location),
    __metadata("design:type", location_1.Location)
], Media.prototype, "location", void 0);
__decorate([
    class_transformer_1.Type(() => user_1.User),
    __metadata("design:type", user_1.User)
], Media.prototype, "user", void 0);
__decorate([
    class_transformer_1.Type(() => comment_1.Comment),
    __metadata("design:type", Object)
], Media.prototype, "caption", void 0);
__decorate([
    class_transformer_1.Type(() => user_1.User),
    __metadata("design:type", Array)
], Media.prototype, "likers", void 0);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Media.prototype, "webLink", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Media.prototype, "account", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Media.prototype, "takenAt", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Media.prototype, "images", null);
__decorate([
    class_transformer_1.Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Media.prototype, "videos", null);
exports.Media = Media;
//# sourceMappingURL=media.js.map