"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
/******************************************************************************
 * Mongoose schema for firms.
 * @param {number} rating a floating number between 0 and 5 representing rating
 * score average of all reviews.
 * @param {number} user_ratings_total an integer number with the number of user
 * reviews given.
 *****************************************************************************/
const firmSchema = new mongoose_1.default.Schema({
    geo_location: Object,
    // lat: String, // "41.5700259",
    // lng: String, // "2.0096398",
    name: {
        type: String,
        maxlength: 45
    },
    email: String,
    name_url: {
        type: String
    },
    address: String,
    place_id: String,
    zip_postal_code: String,
    city: String,
    city_url: String,
    route: String,
    urlp: String,
    region1_name: String,
    region1_url: String,
    country: String,
    key_skills: Array,
    subscription_price_range: Array,
    subscription_price_range_max: Number,
    subscription_price_range_min: Number,
    // From here using places details api
    address_components: Array,
    adr_address: String,
    business_status: String,
    formatted_phone_number: String,
    places_api_name: String,
    places_api_types: Array,
    opening_hours: Object,
    photos: Array,
    rating: Number,
    reviews: Array,
    user_ratings_total: Number,
    maps_url: String,
    utc_offset: Number,
    adr_vicinity: String,
    website: String,
    pricing: {
        type: {
            monthly_cost: Number,
            plan_name: String,
            plan_description: String
        }
    }
});
firmSchema.pre('save', function (next) {
    const random = Math.floor(Math.random() * 1000);
    this.name_url = this.name
        .toLowerCase()
        .trim()
        .replace(/ +(?= )/g, '')
        .replace(/ /g, '-')
        .concat(`-${random}`);
    next();
});
firmSchema.plugin(mongoose_unique_validator_1.default);
const Firm = mongoose_1.default.model('Firm', firmSchema);
exports.default = Firm;
