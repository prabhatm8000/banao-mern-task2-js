"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        ref: "users",
    },
    postId: {
        type: String,
        required: true,
        ref: "posts",
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Comment = mongoose_1.default.model("comments", commentSchema);
exports.default = Comment;
