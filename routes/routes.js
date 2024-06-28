"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const post_1 = __importDefault(require("./post"));
const comment_1 = __importDefault(require("./comment"));
const routes = (0, express_1.Router)();
routes.use("/auth", auth_1.default);
routes.use("/post", post_1.default);
routes.use("/comment", comment_1.default);
exports.default = routes;
