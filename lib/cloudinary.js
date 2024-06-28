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
exports.deletePostFromCloudinary = exports.uploadPostToCloudinary = exports.connectCloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const connectCloudinary = (cloud_name, api_key, api_secret) => {
    cloudinary_1.default.v2.config({
        cloud_name,
        api_key,
        api_secret,
    });
};
exports.connectCloudinary = connectCloudinary;
const uploadPostToCloudinary = (imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base64 = Buffer.from(imageFile.buffer).toString("base64");
        const dataURI = `data:${imageFile.mimetype};base64,${base64}`;
        const result = yield cloudinary_1.default.v2.uploader.upload(dataURI, {
            folder: "bano/posts",
        });
        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }
    catch (error) {
        console.log("Error uploading image to cloudinary: ", error);
        return null;
    }
});
exports.uploadPostToCloudinary = uploadPostToCloudinary;
const deletePostFromCloudinary = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.default.v2.uploader.destroy(public_id);
        return result.result === "ok";
    }
    catch (error) {
        console.log("Error uploading image to cloudinary: ", error);
        return false;
    }
});
exports.deletePostFromCloudinary = deletePostFromCloudinary;
