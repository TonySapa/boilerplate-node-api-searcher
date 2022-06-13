"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingErrorType = exports.wrongFirmId = exports.noFromDate = exports.noMatches = void 0;
const apiMessages = __importStar(require("../../labels/api_messages/firms"));
const devTips = __importStar(require("../../labels/dev_tips/firms"));
exports.noMatches = {
    message_code: 4041,
    message_text: apiMessages.noMatches,
    dev_tip: devTips.noMatches
};
exports.noFromDate = {
    message_code: 4001,
    message_text: apiMessages.noFromDate,
    dev_tip: devTips.noFromDate
};
const wrongFirmId = (id) => ({
    message_code: 4042,
    message_text: apiMessages.wrongFirmId(id),
    dev_tip: devTips.wrongFirmId
});
exports.wrongFirmId = wrongFirmId;
exports.missingErrorType = {
    message_code: 4221,
    message_text: apiMessages.missingErrorType,
    dev_tip: apiMessages.missingErrorType
};
