"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeUnlikePost = exports.updatePost = exports.deletePost = exports.getPostsByUserId = exports.getAllPosts = exports.addPost = void 0;
const cloudinary_1 = require("../lib/cloudinary");
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { title, caption, } = req.body;
        const imageFiles = req.files;
        if (!title || !caption || !imageFiles) {
            return res
                .status(400)
                .send({ message: "All fields are required." });
        }
        const user = yield user_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        const imagesMediaData = [];
        for (let i = 0; i < imageFiles.length; i++) {
            const image = imageFiles[i];
            const imageData = yield (0, cloudinary_1.uploadPostToCloudinary)(image);
            if (!imageData) {
                return res.status(500).send({
                    message: "Something went wrong while uploading image.",
                });
            }
            imagesMediaData.push(Object.assign({}, imageData));
        }
        const newPost = new post_1.default({
            userId,
            title,
            caption,
            images: imagesMediaData,
        });
        yield newPost.save();
        const response = {
            _id: newPost._id,
            userInfo: {
                _id: user._id,
                username: user.username,
            },
            title: newPost.title,
            caption: newPost.caption,
            images: newPost.images,
            likesCount: newPost.likesCount,
            commentsCount: newPost.commentsCount,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt,
        };
        res.status(201).send(response);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while adding post.",
        });
    }
});
exports.addPost = addPost;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const posts = yield post_1.default.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$userId" }],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                            },
                        },
                    ],
                    as: "userInfo",
                },
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    userInfo: {
                        _id: "$userInfo._id",
                        username: "$userInfo.username",
                    },
                    title: 1,
                    caption: 1,
                    images: 1,
                    isLiked: {
                        $in: ["$userId", "$likes"],
                    },
                    likesCount: 1,
                    commentsCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: { updatedAt: -1 },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
        ]);
        const response = posts.map((post) => {
            return {
                _id: post._id,
                userInfo: post.userInfo,
                title: post.title,
                caption: post.caption,
                images: post.images,
                isLiked: post.isLiked,
                likesCount: post.likesCount,
                commentsCount: post.commentsCount,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
        res.status(200).send(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Something went wrong while getting posts.",
        });
    }
});
exports.getAllPosts = getAllPosts;
const getPostsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query.userId || req.userId;
        const posts = yield post_1.default.aggregate([
            {
                $match: {
                    userId,
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$userId" }],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                            },
                        },
                    ],
                    as: "userInfo",
                },
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    userInfo: {
                        _id: "$userInfo._id",
                        username: "$userInfo.username",
                    },
                    title: 1,
                    caption: 1,
                    images: 1,
                    isLiked: {
                        $in: ["$userId", "$likes"],
                    },
                    likesCount: 1,
                    commentsCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: { updatedAt: -1 },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
        ]);
        const response = posts.map((post) => {
            return {
                _id: post._id,
                userInfo: post.userInfo,
                title: post.title,
                caption: post.caption,
                images: post.images,
                isLiked: post.isLiked,
                likesCount: post.likesCount,
                commentsCount: post.commentsCount,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
        res.status(200).send(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Something went wrong while getting posts by userId.",
        });
    }
});
exports.getPostsByUserId = getPostsByUserId;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findById(req.params.id, {
            images: 1,
            userId: 1,
        });
        if (!post) {
            return res.status(404).send({
                message: "Post not found.",
            });
        }
        if (post.userId.toString() !== req.userId) {
            return res.status(403).send({
                message: "You can only delete your own posts.",
            });
        }
        for (let i = 0; i < post.images.length; i++) {
            const flag = yield (0, cloudinary_1.deletePostFromCloudinary)(post.images[i].public_id);
            if (!flag) {
                return res.status(500).send({
                    message: "Something went wrong while deleting post.",
                });
            }
        }
        yield post_1.default.findByIdAndDelete(req.params.id);
        res.status(200).send({
            message: "Post deleted successfully.",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Something went wrong while deleting post.",
        });
    }
});
exports.deletePost = deletePost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, title, caption, } = req.body;
        const post = yield post_1.default.findById(postId, {
            images: 1,
            userId: 1,
        });
        console.log(postId);
        if (!post) {
            return res.status(404).send({
                message: "Post not found.",
            });
        }
        if (post.userId.toString() !== req.userId) {
            return res.status(403).send({
                message: "You can only update your own posts.",
            });
        }
        const user = yield user_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found.",
            });
        }
        const imageFiles = req.files;
        const imagesMediaData = [];
        if (imageFiles && imageFiles.length > 0) {
            // upload new images
            for (let i = 0; i < imageFiles.length; i++) {
                const image = imageFiles[i];
                const imageData = yield (0, cloudinary_1.uploadPostToCloudinary)(image);
                if (!imageData) {
                    return res.status(500).send({
                        message: "Something went wrong while updating post.",
                    });
                }
                imagesMediaData.push(imageData);
            }
            // delete old images
            for (let i = 0; i < post.images.length; i++) {
                const flag = yield (0, cloudinary_1.deletePostFromCloudinary)(post.images[i].public_id);
                if (!flag) {
                    return res.status(500).send({
                        message: "Something went wrong while updating post.",
                    });
                }
            }
        }
        const updatedPost = yield post_1.default.findByIdAndUpdate(postId, {
            title,
            caption,
            images: imagesMediaData.length > 0 ? imagesMediaData : post.images,
        }, {
            new: true,
            projection: {
                userId: 1,
                title: 1,
                caption: 1,
                images: 1,
                likesCount: 1,
                commentsCount: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        });
        if (!updatedPost) {
            return res.status(500).send({
                message: "Something went wrong while updating post.",
            });
        }
        const response = {
            _id: updatedPost._id,
            userId: updatedPost.userId,
            userInfo: {
                _id: user._id,
                username: user.username,
            },
            title: updatedPost.title,
            caption: updatedPost.caption,
            images: updatedPost.images,
            likesCount: updatedPost.likesCount,
            commentsCount: updatedPost.commentsCount,
            createdAt: updatedPost.createdAt,
            updatedAt: updatedPost.updatedAt,
        };
        res.status(200).send(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Something went wrong while updating post.",
        });
    }
});
exports.updatePost = updatePost;
const likeUnlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield post_1.default.findById(postId, {
            userId: 1,
        });
        if (!post) {
            return res.status(404).send({
                message: "Post not found.",
            });
        }
        // if req.userId present in post.likes then remove it else add it and increment likesCount accordingly
        const isLiked = yield post_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(postId),
                },
            },
            {
                $project: {
                    isLiked: {
                        $in: [req.userId, "$likes"],
                    },
                },
            },
        ]);
        if (isLiked[0].isLiked) {
            yield post_1.default.findByIdAndUpdate(postId, {
                $pull: { likes: req.userId },
                $inc: { likesCount: -1 },
            });
        }
        else {
            yield post_1.default.findByIdAndUpdate(postId, {
                $push: { likes: req.userId },
                $inc: { likesCount: 1 },
            });
        }
        res.status(200).send({
            isLiked: !isLiked[0].isLiked,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Something went wrong while liking/unliking post.",
        });
    }
});
exports.likeUnlikePost = likeUnlikePost;
