"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const reportFirmSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    firm_id: String,
    type: {
        type: Number,
        required: true
        // enum: arrayOftypes
    },
    input_text: {
        type: String,
        maxLength: 50
    },
    ip: String
});
reportFirmSchema.plugin(mongoose_unique_validator_1.default);
const ReportFirm = mongoose_1.default.model('ReportFirm', reportFirmSchema);
exports.default = ReportFirm;
