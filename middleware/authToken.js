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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies["auth_token"];
    if (!authToken) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET); //getting id(userId)
        const user = yield user_1.default.findById(decoded.id);
        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        req.userId = user._id.toString();
        next();
    }
    catch (error) {
        return res.status(401).send({ message: "Unauthorized" });
    }
});
exports.default = verifyToken;
