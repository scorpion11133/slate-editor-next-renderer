"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxSerializer = void 0;
const react_1 = __importDefault(require("react"));
// @ts-ignore
const link_1 = __importDefault(require("next/link"));
const uuidShort = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
function isText(node) {
    return "text" in node;
}
function replaceVariables(input, variables) {
    return input.replace(/\${(.*?)}/g, (match, key) => {
        const value = variables[key.trim()];
        return value !== undefined ? String(value) : match;
    });
}
function getLinkComponent(node, variables) {
    const href = variables && node.href
        ? replaceVariables(node.href, variables)
        : node.href || "#";
    const props = { href };
    if (node.target) {
        props.target = node.target;
    }
    const Component = href.startsWith("/") ? link_1.default : "a";
    return { Component, props };
}
function serialize(node, variables) {
    if (isText(node)) {
        let string = variables ? replaceVariables(node.text, variables) : node.text;
        if (node.bold) {
            return react_1.default.createElement("strong", { key: uuidShort() }, string);
        }
        if (node.italic) {
            return react_1.default.createElement("em", { key: uuidShort() }, string);
        }
        if (node.underline) {
            return react_1.default.createElement("u", { key: uuidShort() }, string);
        }
        if (node.color) {
            return react_1.default.createElement("span", { key: uuidShort(), style: { color: node.color } }, string);
        }
        return string;
    }
    const children = node?.children?.map((n) => serialize(n, variables));
    switch (node.type) {
        case "paragraph":
            return react_1.default.createElement("p", { key: uuidShort() }, children);
        case "link":
            const { Component, props } = getLinkComponent(node, variables);
            //@ts-ignore
            return react_1.default.createElement(Component, { key: uuidShort(), ...props }, children);
        case "headingOne":
            return react_1.default.createElement("h1", { key: uuidShort() }, children);
        case "headingTwo":
            return react_1.default.createElement("h2", { key: uuidShort() }, children);
        case "headingThree":
            return react_1.default.createElement("h3", { key: uuidShort() }, children);
        case "unorderedList":
            return react_1.default.createElement("ul", { key: uuidShort() }, children);
        case "list-item":
            return react_1.default.createElement("li", { key: uuidShort() }, children);
        case "alignLeft":
            return react_1.default.createElement("div", { key: uuidShort() }, children);
        case "alignCenter":
            return react_1.default.createElement("div", { key: uuidShort(), style: { textAlign: "center" } }, children);
        case "alignRight":
            return react_1.default.createElement("div", { key: uuidShort(), style: { textAlign: "right" } }, children);
        case "withClassNames":
            return react_1.default.createElement("span", { key: uuidShort(), className: node.attr?.className }, children);
        default:
            //   @ts-ignore
            return children;
    }
}
function jsxSerializer(editorValue, variables) {
    if (editorValue.length > 0) {
        const elements = editorValue.map((n, index) => (react_1.default.createElement(react_1.default.Fragment, { key: index }, serialize(n, variables))));
        return react_1.default.createElement(react_1.default.Fragment, null, elements);
    }
}
exports.jsxSerializer = jsxSerializer;
