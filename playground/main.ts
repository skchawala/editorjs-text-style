import EditorJS from "@editorjs/editorjs";
import type { TextStyleToolConfig } from "../src";
import TextStyleTool from "../src"; // local import

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
      } satisfies TextStyleToolConfig["config"],
    },
  },
});
