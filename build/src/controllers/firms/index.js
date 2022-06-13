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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firm_1 = __importDefault(require("../../models/firm"));
const user_1 = __importDefault(require("../../models/user"));
const handlers_1 = require("./handlers");
const firms_1 = require("../../views/json/firms");
const router = express_1.default.Router();
/******************************************************************************
 * Global projection. Common on all queries. Fields to include/exclude. See
 * mongodb docs about projection:
 * https://docs.mongodb.com/manual/reference/method/db.collection.find/#std-label-method-find-projection
 *****************************************************************************/
const globalProjection = {
    email: 0,
    place_id: 0,
    places_api_types: 0,
    photos: 0,
    utc_offset: 0
};
const globalFilters = {
    country: 'ES',
    // Discard business that are permanently closed.
    $or: [{ business_status: 'OPERATIONAL' }, { business_status: null }]
};
const firmListProjection = {
    // maps_url: 0,
    // opening_hours: 0,
    // formatted_phone_number: 0,
    international_phone_number: 0,
    photos: 0,
    // reviews: 0,
    // website: 0,
    utc_offset: 0
};
// Limit of array size on API response
const limitResponse = 30;
/******************************************************************************
 * Searching firms without specifying pagination or filters will return error.
 *****************************************************************************/
router.get('/all', (_req, res) => {
    res.status(400).send(firms_1.noFromDate);
});
/******************************************************************************
 * Checks that route and API is working.
 *****************************************************************************/
router.get('/health', (_req, res) => {
    res.status(200).send('OK');
});
/******************************************************************************
 * Route to find all firms
 * @param {number} from
 * @param {string} province
 * @param {number} reviews
 * @param {number} price
 * @returns {array} array containing all firms.
 *****************************************************************************/
router.get('/all/:from/:province/:reviews/:price', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const from = req.params && req.params.from && Number(req.params.from)
    const province = req.params && `${req.params.province}` || '';
    const rating = req.params && Number(req.params.reviews) || 0;
    const priceRange = req.params &&
        req.params.price.split('-').map((price) => Number(price)) ||
        [0, 9999];
    const firms = yield firm_1.default
        .find({
        $and: [
            globalFilters,
            (0, handlers_1.byLocation)(province),
            (0, handlers_1.byReviews)(rating),
            (0, handlers_1.byPrice)(priceRange)
        ]
    }, Object.assign(Object.assign({}, globalProjection), firmListProjection))
        .sort({ subscription_price_range_max: -1 });
    // .limit(from + limitResponse)
    const firmsLength = yield firm_1.default
        .find({
        $and: [
            globalFilters,
            (0, handlers_1.byLocation)(province),
            (0, handlers_1.byReviews)(rating),
            (0, handlers_1.byPrice)(priceRange)
        ]
    }, Object.assign(Object.assign({}, globalProjection), firmListProjection))
        .countDocuments();
    const jsonResponse = {
        firms: firms,
        length: firmsLength
    };
    firms && firms.length > 0
        ? res.status(200).json(jsonResponse)
        : res.status(404).send(firms_1.noMatches);
}));
/******************************************************************************
 * @param {string} province a string for the city name
 * @returns {array} array containing all firms if any.
 *****************************************************************************/
router.get('/all/:from/:province', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const from = ((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.from) && Number(req.params.from) || 0;
    const province = req.params && req.params.province;
    const byLocation = {
        $or: [
            { city: province },
            { city_url: province },
            { region1_name: province },
            { region1_url: province }
        ]
    };
    const firms = yield firm_1.default
        .find(Object.assign(Object.assign({}, globalFilters), byLocation), Object.assign(Object.assign({}, globalProjection), firmListProjection))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .limit(from + limitResponse);
    const firmsLength = yield firm_1.default
        .find(Object.assign(Object.assign({}, globalFilters), byLocation), Object.assign(Object.assign({}, globalProjection), firmListProjection))
        .countDocuments();
    const jsonResponse = {
        firms: firms.slice(from, from + limitResponse),
        length: firmsLength
    };
    firms && firms.length > 0
        ? res.status(200).json(jsonResponse)
        : res.status(404).send(firms_1.noMatches);
}));
/******************************************************************************
 * Controller to find a firm specifying "name_url" field.
 * @param {string} province a string for the city name.
 * @returns {array} array containing all firms if any. *
 *****************************************************************************/
router.get('/firm/:name_url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nameUrl = req.params && req.params.name_url;
    const byName = { name_url: encodeURI(nameUrl).toLowerCase() };
    const firm = yield firm_1.default
        .findOne(Object.assign(Object.assign({}, globalFilters), byName), Object.assign({}, globalProjection));
    firm
        ? res.status(200).json(firm)
        : res.status(404).send(firms_1.noMatches);
}));
/******************************************************************************
 * Update firm found by mongodb document id and update it with the data on
 * the request body.
 *****************************************************************************/
router.put('/update-firm/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newFields = req.body;
    const id = req.params.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const updatedFirm = yield firm_1.default.findByIdAndUpdate(id, newFields, { new: true })
        .catch((error) => error);
    updatedFirm
        ? res.status(200).send(updatedFirm)
        : res.status(404).send(updatedFirm);
}));
/******************************************************************************
 * Adds a new firm to the database.
 *****************************************************************************/
router.post('/add-firm', (req, res, next) => {
    // Verify authentication by decoding bearer token.
    return jsonwebtoken_1.default.verify(`${req.token}`, `${process.env.SECRET}`, (error, decodedToken) => {
        if (error) {
            return next(error);
        }
        else {
            // Find and assign the logged in user to the firm and save it.
            user_1.default
                .findOne({
                email: decodedToken.email
            })
                .exec((error, user) => error
                ? next(error)
                : (0, handlers_1.saveFirm)(req, res, user, next));
        }
    });
});
/******************************************************************************
 * Open endpoint to report firms. User can specify if it contains data that
 * is wrong or it might be duplicated or any other issue related to the
 * specific firm.
 *****************************************************************************/
router.post('/report-firm', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req.body.type >= 0)) {
        res.status(422).send(firms_1.missingErrorType);
        return null;
    }
    else {
        const firmId = req.body.firm_id;
        const firm = yield firm_1.default.findById(firmId)
            .orFail();
        if (!firm.id) {
            res.status(404).json((0, firms_1.wrongFirmId)(firmId));
            return null;
        }
        else {
            (0, handlers_1.saveReportFirm)(req, res, next);
            return null;
        }
    }
}));
exports.default = router;
