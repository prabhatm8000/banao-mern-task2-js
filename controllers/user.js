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
exports.getMyUserData = exports.forgotPassword = exports.logout = exports.login = exports.registration = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        if (!userData.email || !userData.password || !userData.username)
            return res.status(400).send({
                message: "username, Email and password are required.",
            });
        if (!userData.email.includes("@"))
            return res.status(400).send({ message: "Invalid email." });
        let user = yield user_1.default.findOne({ email: userData.email });
        if (user)
            return res.status(400).send({ message: "Email already exists." });
        user = new user_1.default(userData);
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("auth_token", token, {
            httpOnly: true, // cookies only for the server
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in miliseconds
        });
        res.status(200).send({ username: user.username, userId: user._id });
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while registering user.",
        });
    }
});
exports.registration = registration;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        if (!userData.username || !userData.password)
            return res
                .status(400)
                .send({ message: "Username and password are required." });
        let user = yield user_1.default.findOne({ username: userData.username });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        const isMatch = yield user.matchPassword(userData.password);
        if (!isMatch)
            return res.status(400).send({ message: "Invalid credentials." });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("auth_token", token, {
            httpOnly: true, // cookies only for the server
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in miliseconds
        });
        res.status(200).send({ username: user.username, userId: user._id });
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while logging in.",
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("auth_token");
        res.status(200).send({ message: "Logged out successfully." });
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while logging out.",
        });
    }
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        if (!userData.email || !userData.username)
            return res
                .status(400)
                .send({ message: "Email and username is required." });
        const user = yield user_1.default.findOne({
            email: userData.email,
            username: userData.username,
        });
        if (!user)
            return res.status(400).send({ message: "User not found." });
        if (!userData.password)
            return res
                .status(400)
                .send({ message: "new password is required." });
        yield user_1.default.findOneAndUpdate({ email: userData.email, username: userData.username }, { password: userData.password }, { new: true });
        res.status(200).send({ message: "Password changed." });
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while resetting password.",
        });
    }
});
exports.forgotPassword = forgotPassword;
const getMyUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.userId);
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong while getting user data.",
        });
    }
});
exports.getMyUserData = getMyUserData;
