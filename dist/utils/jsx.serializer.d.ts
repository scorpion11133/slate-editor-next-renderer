import React from "react";
declare type TextNode = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
};
export declare type BaseNode = {
    type: string;
    children: Node[];
    href?: string;
    target?: string;
    attr?: {
        className?: string;
    };
};
declare type Node = TextNode | BaseNode;
export declare type Variables = Record<string, string | number> | undefined;
export declare function jsxSerializer(editorValue: BaseNode[], variables: Variables): React.FunctionComponentElement<{
    children?: React.ReactNode;
}> | undefined;
export {};
