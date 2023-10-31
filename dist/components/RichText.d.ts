import React from "react";
import { BaseNode, Variables } from "../utils/jsx.serializer";
declare type RichTextProps = {
    translation: string | BaseNode[];
    variables?: Variables;
};
export declare const RichText: ({ translation, variables }: RichTextProps) => React.JSX.Element | undefined;
export {};
