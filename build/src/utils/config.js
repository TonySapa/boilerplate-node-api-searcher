"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = exports.MONGODB_URI = exports.MAIL_PASSWORD = exports.MAIL_USER = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3001;
exports.MAIL_USER = process.env.MAIL_USER;
exports.MAIL_PASSWORD = process.env.MAIL_PASSWORD;
exports.MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.NODE_ENV === 'development'
        ? process.env.MONGODB_URI_DEV
        : process.env.NODE_ENV === 'dev-test'
            ? process.env.MONGODB_URI_TEST
            : process.env.MONGODB_URI_PRO;
exports.API_URL = process.env.NODE_ENV === 'production'
    ? 'https://www.ticktax.io/api'
    : 'http:localhost:3000/api';
