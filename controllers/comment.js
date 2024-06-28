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
exports.deleteComment = exports.getComments = exports.addComment = void 0;
const comments_1 = __importDefault(require("../models/comments"));
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const postId = req.params.postId;
        const { comment } = req.body;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        const post = yield post_1.default.findById(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found." });
        }
        const commentData = new comments_1.default({
            userId,
            postId,
            comment,
        });
        yield commentData.save();
        // increment comment count
        yield post_1.default.findOneAndUpdate({ _id: post._id }, { $inc: { commentsCount: 1 } });
        const response = {
            _id: commentData._id,
            userId: commentData.userId,
            userInfo: {
                _id: user._id,
                username: user.username,
            },
            postId: commentData.postId,
            comment: commentData.comment,
            createdAt: commentData.createdAt,
            updatedAt: commentData.updatedAt,
        };
        res.status(200).send(response);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while adding comment.",
        });
    }
});
exports.addComment = addComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const comments = yield comments_1.default.aggregate([
            {
                $match: {
                    postId,
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
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    postId: 1,
                    comment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userInfo: {
                        _id: "$user._id",
                        username: "$user.username",
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
        ]);
        res.status(200).send(comments);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while getting comments.",
        });
    }
});
exports.getComments = getComments;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.id;
        const userId = req.userId;
        const comment = yield comments_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).send({ message: "Comment not found." });
        }
        if (comment.userId.toString() !== userId) {
            return res.status(403).send({ message: "Unauthorized." });
        }
        yield comments_1.default.findByIdAndDelete(commentId);
        // decrement comment count
        const post = yield post_1.default.findOneAndUpdate({ _id: comment.postId }, { $inc: { commentsCount: -1 } }, { new: true });
        res.status(200).send({ message: "Comment deleted successfully." });
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while deleting comment.",
        });
    }
});
exports.deleteComment = deleteComment;
