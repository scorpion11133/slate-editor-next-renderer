import React from "react";
// @ts-ignore
import Link from "next/link";

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

  const props: LinkProps = { href };

  if (node.target) {
    props.target = node.target;
  }

  const Component = href.startsWith("/") ? Link : "a";

  return { Component, props };
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
      return React.createElement("strong", { key: uuidShort() }, string);
    }
    if (node.italic) {
      return React.createElement("em", { key: uuidShort() }, string);
    }
    if (node.underline) {
      return React.createElement("u", { key: uuidShort() }, string);
    }
    if (node.color) {
      return React.createElement(
        "span",
        { key: uuidShort(), style: { color: node.color } },
        string,
      );
    }
    return string;
  }

  const children = node?.children?.map((n) => serialize(n, variables));
  switch (node.type) {
    case "paragraph":
      return React.createElement("p", { key: uuidShort() }, children);
    case "link":
      const { Component, props } = getLinkComponent(node, variables);
      //@ts-ignore
      return React.createElement(
        Component,
        { key: uuidShort(), ...props },
        children,
      );
    case "headingOne":
      return React.createElement("h1", { key: uuidShort() }, children);
    case "headingTwo":
      return React.createElement("h2", { key: uuidShort() }, children);
    case "headingThree":
      return React.createElement("h3", { key: uuidShort() }, children);
    case "unorderedList":
      return React.createElement("ul", { key: uuidShort() }, children);
    case "list-item":
      return React.createElement("li", { key: uuidShort() }, children);
    case "alignLeft":
      return React.createElement("div", { key: uuidShort() }, children);
    case "alignCenter":
      return React.createElement(
        "div",
        { key: uuidShort(), style: { textAlign: "center" } },
        children,
      );
    case "alignRight":
      return React.createElement(
        "div",
        { key: uuidShort(), style: { textAlign: "right" } },
        children,
      );
    case "withClassNames":
      return React.createElement(
        "span",
        { key: uuidShort(), className: node.attr?.className },
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
