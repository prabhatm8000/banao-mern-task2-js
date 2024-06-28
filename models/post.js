"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mediaSchema = new mongoose_1.default.Schema({
    public_id: { type: String, required: true },
    url: { type: String, required: true },
});
const postSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        ref: "users",
    },
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    images: [mediaSchema],
    likesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    likes: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
const Post = mongoose_1.default.model("posts", postSchema);
exports.default = Post;
