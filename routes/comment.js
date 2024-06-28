"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_1 = require("../controllers/comment");
const authToken_1 = __importDefault(require("../middleware/authToken"));
const commentRouter = (0, express_1.Router)();
commentRouter.use(authToken_1.default);
commentRouter.post("/:postId", comment_1.addComment);
commentRouter.get("/:postId", comment_1.getComments);
commentRouter.delete("/:id", comment_1.deleteComment);
exports.default = commentRouter;
