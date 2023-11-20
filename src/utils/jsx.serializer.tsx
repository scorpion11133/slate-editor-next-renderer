import React from "react";
// @ts-ignore
import Link from "next/link";

enum NodeType {
    Paragraph = "paragraph",
    ListItem = "list-item",
    OrderedList = "orderedList",
    UnorderedList = "unorderedList",
    Link = "link",
    WithClassNames = "withClassNames",
    ColorPicker = "color-picker",
    Color = "color",
    HeadingOne = "headingOne",
    HeadingTwo = "headingTwo",
    HeadingThree = "headingThree",
    HeadingFour = "headingFour",
    HeadingFive = "headingFive",
    HeadingSix = "headingSix",
    AlignLeft = "alignLeft",
    AlignCenter = "alignCenter",
    AlignRight = "alignRight",
    Bold = "bold",
    Italic = "italic",
    Underline = "underline",
}

type TextNode = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
};

export type BaseNode = {
    type: string;
    children: Node[];
    href?: string;
    target?: string;
    attr?: {
        className?: string;
    };
};

type Node = TextNode | BaseNode;

type LinkProps = {
    href: string;
    target?: string;
};

export type Variables = Record<string, string | number> | undefined;

const uuidShort = () =>
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);

function isText(node: Node): node is TextNode {
    return "text" in node;
}

function replaceVariables(input: string, variables: NonNullable<Variables>) {
    return input.replace(/\${(.*?)}/g, (match, key) => {
        const value = variables[key.trim()];
        return value !== undefined ? String(value) : match;
    });
}

function getLinkComponent(node: BaseNode, variables: Variables) {
    const href =
        variables && node.href
            ? replaceVariables(node.href, variables)
            : node.href || "#";

    const props: LinkProps = {href};

    if (node.target) {
        props.target = node.target;
    }

    const Component = href.startsWith("/") ? Link : "a";

    return {Component, props};
}

function serialize(
    node: Node,
    variables: Variables,
):
    | React.DetailedReactHTMLElement<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
>
    | string {
    if (isText(node)) {
        let string = variables ? replaceVariables(node.text, variables) : node.text;

        if (node.bold) {
            return React.createElement("strong", {key: uuidShort()}, string);
        }
        if (node.italic) {
            return React.createElement("em", {key: uuidShort()}, string);
        }
        if (node.underline) {
            return React.createElement("u", {key: uuidShort()}, string);
        }
        if (node.color) {
            return React.createElement(
                "span",
                {key: uuidShort(), style: {color: node.color}},
                string,
            );
        }
        return string;
    }

    const children = node?.children?.map((n) => serialize(n, variables));
    switch (node.type) {
        case NodeType.Paragraph:
            return React.createElement("p", {key: uuidShort()}, children);
        case NodeType.Link:
            const {Component, props} = getLinkComponent(node, variables);
            //@ts-ignore
            return React.createElement(
                Component,
                {key: uuidShort(), ...props},
                children,
            );
        case NodeType.HeadingOne :
            return React.createElement("h1", {key: uuidShort()}, children);
        case NodeType.HeadingTwo:
            return React.createElement("h2", {key: uuidShort()}, children);
        case NodeType.HeadingThree:
            return React.createElement("h3", {key: uuidShort()}, children);
        case NodeType.HeadingFour:
            return React.createElement("h4", {key: uuidShort()}, children);
        case NodeType.HeadingFive:
            return React.createElement("h5", {key: uuidShort()}, children);
        case NodeType.HeadingSix:
            return React.createElement("h6", {key: uuidShort()}, children);
        case NodeType.UnorderedList:
            return React.createElement("ul", {key: uuidShort()}, children);
        case NodeType.ListItem:
            return React.createElement("li", {key: uuidShort()}, children);
        case NodeType.AlignLeft:
            return React.createElement("div", {key: uuidShort()}, children);
        case NodeType.AlignCenter:
            return React.createElement(
                "div",
                {key: uuidShort(), style: {textAlign: "center"}},
                children,
            );
        case NodeType.AlignRight:
            return React.createElement(
                "div",
                {key: uuidShort(), style: {textAlign: "right"}},
                children,
            );
        case NodeType.WithClassNames:
            return React.createElement(
                "span",
                {key: uuidShort(), className: node.attr?.className},
                children,
            );

        default:
            //   @ts-ignore
            return children;
    }
}

export function jsxSerializer(editorValue: BaseNode[], variables: Variables) {
    if (editorValue.length > 0) {
        const elements = editorValue.map((n, index) => (
            <React.Fragment key={index}>{serialize(n, variables)}</React.Fragment>
        ));
        return React.createElement(React.Fragment, null, elements);
    }
}
