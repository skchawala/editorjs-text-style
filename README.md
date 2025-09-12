# EditorJS Text Style Tool

✍️ An EditorJS inline tool for customizing **font size** and **font family** — lightweight, configurable, and easy to use.

---

## Features

- 🎨 Change **font size** inline
- 🅰️ Switch **font family**
- ⚡ Plug & Play with EditorJS
- 🔧 Fully configurable (define your own sizes and families)
- 🪶 Lightweight, no extra dependencies

---

## Installation

Install via npm or yarn:

```bash
npm install editorjs-text-style
```

### or

```bash
yarn add editorjs-text-style
```

## 🚀 Usage

```bash
import EditorJS from "@editorjs/editorjs";
import TextStyleTool from "editorjs-text-style";

const editor = new EditorJS({
  holder: "editorjs",
  autofocus: true,
  tools: {
    textStyle: {
      class: TextStyleTool,
      config: {
        fontSizeEnabled: true,
        fontFamilyEnabled: true,
        fontSizes: [
          { label: "12px", value: "12px" },
          { label: "14px", value: "14px" },
          { label: "16px", value: "16px" },
          { label: "18px", value: "18px" },
          { label: "20px", value: "20px" },
        ],
        fontFamilies: [
          { label: "Arial", value: "Arial" },
          { label: "Georgia", value: "Georgia" },
          { label: "Courier New", value: "Courier New" },
          { label: "Verdana", value: "Verdana" },
        ],
        defaultFontSize: "20px",
        defaultFontFamily: "Verdana",
      },
    },
  },
});
```

## ⚙️ Configuration Options

| Option              | Type                 | Default               | Description                                            |
| ------------------- | -------------------- | --------------------- | ------------------------------------------------------ |
| `fontSizeEnabled`   | `boolean`            | `true`                | Enable or disable font size dropdown                   |
| `fontFamilyEnabled` | `boolean`            | `true`                | Enable or disable font family dropdown                 |
| `fontSizes`         | `FontSizeOption[]`   | Predefined set        | Custom array of font size options `{ label, value }`   |
| `fontFamilies`      | `FontFamilyOption[]` | Predefined set        | Custom array of font family options `{ label, value }` |
| `defaultFontSize`   | `string`             | `"16px"`              | Default font size applied when no selection is made    |
| `defaultFontFamily` | `string`             | `"Inter, sans-serif"` | Default font family applied                            |

## 🛠️ Output Data

```bash
<p>
  This is <span class="cdx-text-style" style="font-size: 20px; font-family: Verdana;">styled text</span> inside Editor.js.
</p>
```
