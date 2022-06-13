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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../../models/user"));
const users_1 = require("../../views/json/users");
const handlers_1 = require("./handlers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const domain_1 = require("../../domain");
const router = express_1.default.Router();
/******************************************************************************
 * Route to monitor health of application
 *****************************************************************************/
router.get('/ping', (_req, res) => {
    res.send('Hello World');
});
/******************************************************************************
 * User sign-up endpoint through Bearer token. Taking email and password as
 * parameters, stores it into mongodb and sends email of confirmation.
 * The response is a 201 informing the user that an email of confirmation has
 * been sent.
 * @param {string} email user email to register.
 * @param {string} password user literal password.
 *****************************************************************************/
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const { email, password, language } = req.body;
    const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
    const accountStatusToken = yield bcrypt_1.default.hash(email, saltRounds);
    if (!domain_1.USER_LANGUAGES.includes(language || 'enUS')) {
        return res.status(422).json(users_1.languageUnspecified);
    }
    const user = new user_1.default({
        email,
        passwordHash,
        accountStatusToken
    });
    if (!language) {
        return res.status(422).json(users_1.languageUnspecified);
    }
    else if (!(0, handlers_1.validatePassword)(password)) {
        return res.status(422).json(users_1.passwordTooShort);
    }
    else {
        return user.save()
            .then((savedUser) => res.status(201).json(Object.assign(Object.assign({}, users_1.userRegistered), { crud: {
                before: null,
                after: savedUser
            } })))
            .catch((error) => {
            throw new Error(`Couldn't store on mongo. ${error}`);
        })
            .catch((error) => res.status(400).send(`${error}`));
    }
}));
/******************************************************************************
 * User will request this url to confirm email on signup. Is the link that
 * appears on confirmation email.
 * @return void. On visit, user record on database will be registered as
 * confirmed.
 *****************************************************************************/
router.get('/signup/:accountStatusToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accountStatusToken = req.params.accountStatusToken;
    // Find user by signup_confirmation_url
    const user = yield user_1.default.findOne({ accountStatusToken });
    const crud = { account_status: 'active', accountStatusToken: null };
    if (user) {
        user_1.default.updateOne({ accountStatusToken }, { $set: crud })
            .then(() => res.status(200).json(Object.assign(Object.assign({}, users_1.userRegistered), { crud: {
                before: user,
                after: Object.assign(Object.assign({}, user), crud)
            } })))
            .catch((error) => res.status(400).send(`${error}`));
    }
    else {
        res.status(400).send(users_1.invalidConfirmationLink);
    }
}));
/******************************************************************************
 * User will post email and password to log in to the application.
 * @returns {object} token and email fields.
 *****************************************************************************/
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = `${req.body.password}`;
    const email = `${req.body.email}`;
    const user = yield user_1.default.findOne({ email });
    const passwordHash = `${user ? user.passwordHash : ''}`;
    const passwordCorrect = user === null
        ? false
        : yield bcrypt_1.default.compare(password, passwordHash);
    if (!(user && passwordCorrect)) {
        return res.status(401).send(users_1.loginFailed);
    }
    // If account_status !== 'active'. By default we will accept unconfirmed emails
    // so users can start using the app without any hassle.
    /* if (user.account_status !== typesOfAccountStatus[1]) {
      return res.status(401).send('Account is not validated')
    } */
    const userForToken = {
        email: user.email,
        password: user.passwordHash
    };
    const token = jsonwebtoken_1.default.sign(userForToken, `${process.env.SECRET}`);
    return res.status(200).send({ token, email: user.email });
}));
exports.default = router;
