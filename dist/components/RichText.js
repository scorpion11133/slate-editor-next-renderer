"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichText = void 0;
const react_1 = __importDefault(require("react"));
const jsx_serializer_1 = require("../utils/jsx.serializer");
const RichText = ({ translation, variables }) => {
    if (typeof translation === "string") {
        return react_1.default.createElement(react_1.default.Fragment, null, translation);
    }
    return (0, jsx_serializer_1.jsxSerializer)(translation, variables);
};
exports.RichText = RichText;
