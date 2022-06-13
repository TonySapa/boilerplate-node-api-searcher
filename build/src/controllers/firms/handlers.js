"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.byPrice = exports.byReviews = exports.byLocation = exports.saveReportFirm = exports.saveFirm = void 0;
const misc_1 = require("../../labels/misc");
const firm_1 = __importDefault(require("../../models/firm"));
const report_firm_1 = __importDefault(require("../../models/report_firm"));
/******************************************************************************
 * Stores document in to mongodb collection.
 * @param {Request} req the http request
 * @param {Response} res the http response of the API.
 * @param {UserType} user the authenticated user requesting the CRUD operation.
 * @param {NextFunction} next callback function.
 * @returns a 201 with the new entry
 *****************************************************************************/
const saveFirm = (req, res, user, next) => {
    var _a;
    const userId = user && ((_a = user._id) === null || _a === void 0 ? void 0 : _a.toString());
    const firm = req.body;
    void new firm_1.default(Object.assign(Object.assign({ country: misc_1.defaultCountry }, firm), { user: userId }))
        .save((error, savedFirm) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(201).json(savedFirm);
        }
    });
};
exports.saveFirm = saveFirm;
/******************************************************************************
 * Non-logged in visitors use this endpoint to report a firm. Missleading,
 * wrong or repeated data that helps moderate the content.
 * @param {Request} req the http request
 * @param {Response} res the http response of the API.
 * @param {NextFunction} next callback function.
 * @returns a 201 with the new entry
 *****************************************************************************/
const saveReportFirm = (req, res, next) => {
    const ip = req.socket.remoteAddress;
    const report = new report_firm_1.default(Object.assign({ ip: ip }, req.body));
    void new report_firm_1.default({ report })
        .save((error, savedFirm) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(201).json(savedFirm);
        }
    });
};
exports.saveReportFirm = saveReportFirm;
/******************************************************************************
 * Filter by geographical location.
 * @param {string} province the string of geographical location to filter by.
 *****************************************************************************/
const byLocation = (province) => {
    const filter = {
        $or: [
            { city: province },
            { city_url: province },
            { region1_name: province },
            { region1_url: province }
        ]
    };
    return province === 'undefined' || province === 'null'
        ? {}
        : filter;
};
exports.byLocation = byLocation;
/******************************************************************************
 * Filter by average rating of reviews.
 * @param {number} rating floating number of the average rating of reviews.
 *****************************************************************************/
const byReviews = (rating) => {
    const filter = {
        $or: [
            { rating: { $gte: rating } },
            { rating: null }
        ]
    };
    return rating > 0
        ? filter
        : {};
};
exports.byReviews = byReviews;
/******************************************************************************
 * Filter by price ranges.
 * @param {Array<number>} priceRange array containing min and max values of
 * pricing plans of the firm.
 *****************************************************************************/
const byPrice = (priceRange) => {
    const filter = {
        $or: [
            { $and: [
                    { subscription_price_range_max: { $gte: priceRange[0] } },
                    { subscription_price_range_min: { $lte: priceRange[1] } }
                ] },
            {
                pricing: null,
                subscription_price_range_min: null,
                subscription_price_range_max: null
            }
        ]
    };
    return priceRange && priceRange.length === 2
        ? filter
        : {};
};
exports.byPrice = byPrice;
