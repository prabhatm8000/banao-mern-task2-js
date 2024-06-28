"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const authToken_1 = __importDefault(require("../middleware/authToken"));
const authRouter = (0, express_1.Router)();
authRouter.post("/registration", user_1.registration);
authRouter.post("/login", user_1.login);
authRouter.post("/logout", user_1.logout);
authRouter.post("/forgot-password", user_1.forgotPassword);
authRouter.get("/get-my-userdata", authToken_1.default, user_1.getMyUserData);
authRouter.get("/verify-token", authToken_1.default, (req, res) => {
    res.status(200).send({ userId: req.userId });
});
exports.default = authRouter;
