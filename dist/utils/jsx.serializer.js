"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxSerializer = void 0;
const react_1 = __importDefault(require("react"));
// @ts-ignore
const link_1 = __importDefault(require("next/link"));
var NodeType;
(function (NodeType) {
    NodeType["Paragraph"] = "paragraph";
    NodeType["ListItem"] = "list-item";
    NodeType["OrderedList"] = "orderedList";
    NodeType["UnorderedList"] = "unorderedList";
    NodeType["Link"] = "link";
    NodeType["WithClassNames"] = "withClassNames";
    NodeType["ColorPicker"] = "color-picker";
    NodeType["Color"] = "color";
    NodeType["HeadingOne"] = "headingOne";
    NodeType["HeadingTwo"] = "headingTwo";
    NodeType["HeadingThree"] = "headingThree";
    NodeType["HeadingFour"] = "headingFour";
    NodeType["HeadingFive"] = "headingFive";
    NodeType["HeadingSix"] = "headingSix";
    NodeType["AlignLeft"] = "alignLeft";
    NodeType["AlignCenter"] = "alignCenter";
    NodeType["AlignRight"] = "alignRight";
    NodeType["Bold"] = "bold";
    NodeType["Italic"] = "italic";
    NodeType["Underline"] = "underline";
})(NodeType || (NodeType = {}));
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
        case NodeType.Paragraph:
            return react_1.default.createElement("p", { key: uuidShort() }, children);
        case NodeType.Link:
            const { Component, props } = getLinkComponent(node, variables);
            //@ts-ignore
            return react_1.default.createElement(Component, { key: uuidShort(), ...props }, children);
        case NodeType.HeadingOne:
            return react_1.default.createElement("h1", { key: uuidShort() }, children);
        case NodeType.HeadingTwo:
            return react_1.default.createElement("h2", { key: uuidShort() }, children);
        case NodeType.HeadingThree:
            return react_1.default.createElement("h3", { key: uuidShort() }, children);
        case NodeType.HeadingFour:
            return react_1.default.createElement("h4", { key: uuidShort() }, children);
        case NodeType.HeadingFive:
            return react_1.default.createElement("h5", { key: uuidShort() }, children);
        case NodeType.HeadingSix:
            return react_1.default.createElement("h6", { key: uuidShort() }, children);
        case NodeType.UnorderedList:
            return react_1.default.createElement("ul", { key: uuidShort() }, children);
        case NodeType.ListItem:
            return react_1.default.createElement("li", { key: uuidShort() }, children);
        case NodeType.AlignLeft:
            return react_1.default.createElement("div", { key: uuidShort() }, children);
        case NodeType.AlignCenter:
            return react_1.default.createElement("div", { key: uuidShort(), style: { textAlign: "center" } }, children);
        case NodeType.AlignRight:
            return react_1.default.createElement("div", { key: uuidShort(), style: { textAlign: "right" } }, children);
        case NodeType.WithClassNames:
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
