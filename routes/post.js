"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../controllers/post");
const multer_1 = __importDefault(require("multer"));
const authToken_1 = __importDefault(require("../middleware/authToken"));
const postRouter = (0, express_1.Router)();
postRouter.use(authToken_1.default);
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_LENGTH_OF_IMAGES = 3;
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
}); // 3MB file size limit
postRouter.post("/", upload.array("imageFiles", MAX_LENGTH_OF_IMAGES), post_1.addPost);
postRouter.get("/all", post_1.getAllPosts);
postRouter.get("/by-userId", post_1.getPostsByUserId);
postRouter.delete("/:id", post_1.deletePost);
postRouter.patch("/", upload.array("imageFiles", MAX_LENGTH_OF_IMAGES), post_1.updatePost);
postRouter.post("/:id/likeUnlike", post_1.likeUnlikePost);
exports.default = postRouter;
