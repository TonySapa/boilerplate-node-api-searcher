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
/* eslint-disable @typescript-eslint/no-unsafe-call */
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../models/user"));
const entry_1 = __importDefault(require("../../models/entry"));
const handlers_1 = require("./handlers");
// import { tokenFailed } from '../views/json/users'
const router = express_1.default.Router();
/******************************************************************************
 * Health endpoint to monitor that  the route is working
 *****************************************************************************/
router.get('/ping', (_req, res) => {
    res.send('Hello World');
});
/******************************************************************************
 * Gets all entries without any filters
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entries = yield entry_1.default
        .find({}).populate('user', { username: 1, name: 1 });
    res.json(entries);
}));
/******************************************************************************
 * Gets entries where field2 falls between "min" and "max" values.
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/range/:min/:max', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { min, max } = req.params;
    const entries = yield entry_1.default
        .find({
        field2: { $gte: min, $lte: max }
    })
        .populate('user', { username: 1, name: 1 });
    res.json(entries);
}));
/******************************************************************************
 * Gets entries where field2 falls between "min" and "max" values. The field2
 * in this case is an array of multiple values.
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/range/:min/:max', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { min, max } = req.params;
    const entries = yield entry_1.default
        .find({
        field3: { $gte: min, $lte: max }
    })
        .populate('user', { username: 1, name: 1 });
    res.json(entries);
}));
/******************************************************************************
 * Get a specific entry, found by id
 * @access a token is NOT needed
 * @param {string} id the id to match
 * @returns a 200 with the matched entry
 *****************************************************************************/
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield entry_1.default.findById(req.params.id);
    entry
        ? res.status(200).json(entry)
        : res.status(404).json({ error: 'No entry found with that id' });
}));
/******************************************************************************
 * Deletes a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 204 with no content
 *****************************************************************************/
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jsonwebtoken_1.default.verify(`${req.token}`, `${process.env.SECRET}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = decodedToken.id;
    if (!req.token || !userId) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }
    else {
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'User invalid' });
        }
        else {
            const entry = yield entry_1.default.findById(req.params.id);
            if (entry && (entry.user.toString() !== userId)) {
                return res
                    .status(401).json({ error: 'only the creator can delete it' });
            }
            else {
                entry && (yield (entry === null || entry === void 0 ? void 0 : entry.remove()));
                return res.status(204).end();
            }
        }
    }
}));
/******************************************************************************
 * Updates a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 200 with the updated entry
 *****************************************************************************/
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entry = req.body;
    const updatedEntry = yield entry_1.default
        .findByIdAndUpdate(req.params.id, entry, { new: true });
    if (!updatedEntry) {
        return res.status(400).send({ error: 'No entry exists with that id' });
    }
    else {
        return res.json(updatedEntry.toJSON());
    }
}));
/******************************************************************************
 * Creates a new entry.
 * @access a token IS needed
 * @param {EntryType} entry
 * @returns a 201 with the new entry
 *****************************************************************************/
router.post('/', (req, res, next) => {
    // Verify authentication by decoding bearer token.
    return jsonwebtoken_1.default.verify(`${req.token}`, `${process.env.SECRET}`, (error, decodedToken) => {
        if (error) {
            return next(error);
        }
        else {
            // Find and assign the logged in user to the entry and save it.
            user_1.default
                .findOne({
                email: decodedToken.email
            })
                .exec((error, user) => error
                ? next(error)
                : (0, handlers_1.saveEntry)(req, res, user, next));
        }
    });
});
exports.default = router;
