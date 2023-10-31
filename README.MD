# @scorpion11133/slate-editor-next-renderer

## Example of data for `translationsService(repoTypesExample)` argument:
```js
const repoTypesExample = {
  "111": {
    "1": "1 1 1 1",
    "2": [
      { type: "paragraph", children: [{ text: "222" }] },
      {
        type: "paragraph",
        children: [{ text: "22323 " }, { text: "ad", bold: true }],
      },
    ],
    string_with_vars: "My name is {{name}}. I am {{years}} years old.",
  },
  "222": {
    "1": "11 1",
    "2": "2",
    "333": [
      { type: "paragraph", children: [{ text: "adsdsadasd", bold: true }] },
      { type: "paragraph", children: [{ text: "asd", italic: true }] },
    ],
  },
  "333": {
    "1": "1 1 1 1 ",
    "2": [
      {
        type: "paragraph",
        children: [
          { text: "" },
          {
            type: "link",
            href: "https://tanstack.com/",
            children: [{ text: "asdasd" }],
          },
          { text: "" },
        ],
      },
    ],
  },
  "444": {
    test1: [
      { type: "paragraph", children: [{ text: "asdasd", color: "#d22d2d" }] },
    ],
  },
};
```

## Usage example in the NextJS component:
```js
import {RichText, translationsService} from "@scorpion11133/slate-editor-next-renderer";

const SomeComponent() {
    const t = translationsService(repoTypesExample);

    return (
        <>
            <p>{t("111.1")}</p>
            <RichText translation={t("111.2")} />
            <p>{t("111.string_with_vars", { name: "Some name", years: 2 })}</p>
            <RichText translation={t("222.333ddd")} />
            <p>{t("333.1asd")}</p>
            <RichText
                translation={t("333.2")}
                variables={{ name: "Some other name", years: 2, userId: 99999 }}
            />
            <RichText translation={t("444.test21")} />
        </>
    );
}


```
If the translation value is `string` it may be passed to any regular JSX-tag or with `RichText` component.

If the translation value is `array` use **only** `RichText` component

## Types
```ts
type BaseNode = {
  type: string; 
  children: Node[];
  href?: string;
  target?: string;
  attr?: {
    className?: string;
  };
}

type Variables = Record<string, string | number> | undefined;
```

## RichText Props 

| Name          | Type                   | isRequired | Description                                                                       |
|:--------------|:-----------------------|:-----------|:----------------------------------------------------------------------------------|
| `translation` | `string or BaseNode[]` | `true`     |                                                                                   |
| `variables`   | `Variables`            | `false`    | Variables used in the editor are enclosed in double curly braces (e.g., {{name}}) |
