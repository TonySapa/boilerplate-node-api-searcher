"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseString = void 0;
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseComment = (comment) => {
    if (!comment || !isString(comment)) {
        throw new Error('Incorrect or missing comment');
    }
    return comment;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isWeather = (param) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(types_1.Weather).includes(param);
};
const parseWeather = (weather) => {
    if (!weather || !isWeather(weather)) {
        throw new Error('Incorrect or missing weather: ' + weather);
    }
    return weather;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVisibility = (param) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(types_1.Visibility).includes(param);
};
const parseVisibility = (visibility) => {
    if (!visibility || !isVisibility(visibility)) {
        throw new Error('Incorrect or missing visibility: ' + visibility);
    }
    return visibility;
};
const toNewDiaryEntry = ({ comment, date, weather, visibility }) => {
    const newEntry = {
        comment: parseComment(comment),
        date: parseDate(date),
        weather: parseWeather(weather),
        visibility: parseVisibility(visibility)
    };
    return newEntry;
};
function parseString(item) {
    if (typeof item === 'string') {
        return item;
    }
    else {
        throw new Error('Item is not a string.');
    }
}
exports.parseString = parseString;
exports.default = toNewDiaryEntry;
