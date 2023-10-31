import React from "react";
import { BaseNode, jsxSerializer, Variables } from "../utils/jsx.serializer";

type RichTextProps = {
  translation: string | BaseNode[];
  variables?: Variables;
};

export const RichText = ({ translation, variables }: RichTextProps) => {
  if (typeof translation === "string") {
    return <>{translation}</>;
  }

  return jsxSerializer(translation, variables);
};
