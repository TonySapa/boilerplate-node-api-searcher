"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const pricingPlanSchema = new mongoose_1.Schema({
    monthly_cost: {
        type: Number,
        required: true
    },
    plan_name: {
        type: String
    },
    plan_description: {
        type: String
    }
});
pricingPlanSchema.plugin(mongoose_unique_validator_1.default);
const PricingPlan = (0, mongoose_1.model)('PricingPlan', pricingPlanSchema);
exports.default = PricingPlan;
