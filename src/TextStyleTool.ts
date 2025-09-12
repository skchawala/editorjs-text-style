import type {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from "@editorjs/editorjs";

export type FontSizeOption = { label: string; value: string };
export type FontFamilyOption = { label: string; value: string };
interface TextStyleConfig {
  fontSizeEnabled?: boolean;
  fontFamilyEnabled?: boolean;
  fontSizes?: FontSizeOption[];
  fontFamilies?: FontFamilyOption[];
  defaultFontSize?: string;
  defaultFontFamily?: string;
}

const CSS = "cdx-text-style";

export default class TextStyleInlineTool implements InlineTool {
  private api: API;
  private button: HTMLButtonElement;
  private config: TextStyleConfig;
  constructor({
    api,
    config,
  }: InlineToolConstructorOptions & { config?: TextStyleConfig }) {
    this.api = api;
    this.config = {
      fontSizeEnabled: config.fontSizeEnabled ?? true,
      fontFamilyEnabled: config.fontFamilyEnabled ?? true,
      fontSizes: config.fontSizes ?? [
        { label: "Small (14px)", value: "14px" },
        { label: "Normal (16px)", value: "16px" },
        { label: "Readable (18px)", value: "18px" },
        { label: "Large (20px)", value: "20px" },
        { label: "XL (24px)", value: "24px" },
      ],
      fontFamilies: config.fontFamilies ?? [
        { label: "Inter", value: "Inter, sans-serif" },
        { label: "Roboto", value: "Roboto, sans-serif" },
        { label: "Georgia", value: "Georgia, serif" },
        { label: "Merriweather", value: "Merriweather, serif" },
        {
          label: "System UI",
          value:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      ],
      defaultFontSize: config.defaultFontSize ?? "16px",
      defaultFontFamily: config.defaultFontFamily ?? "Inter, sans-serif",
    };
    this.button = this.createButton();
  }
  static get title() {
    return "Text Style";
  }
  static get isInline() {
    return true;
  }

  static get CSS() {
    return CSS;
  }

  private toggleActiveClass(flag: boolean) {
    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, flag);
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = "Aa"; // replace with svg icon if needed
    button.classList.add(this.api.styles.inlineToolButton);
    button.addEventListener("mousedown", (e) => {
      // prevent text deselection when clicking the button
      e.preventDefault();
    });
    return button;
  }

  render(): HTMLElement {
    return this.button;
  }

  wrap(range: Range) {
    const selected = range.extractContents();
    const span = document.createElement("span");
    span.classList.add(TextStyleInlineTool.CSS);

    // Apply font styles from dropdowns (if present)
    if (this.config.fontSizeEnabled) {
      const fontSize = (
        document.querySelector("#text-style-font-size") as HTMLSelectElement
      )?.value;
      if (fontSize) span.style.fontSize = fontSize;
    }

    if (this.config.fontFamilyEnabled) {
      const fontFamily = (
        document.querySelector("#text-style-font-family") as HTMLSelectElement
      )?.value;
      if (fontFamily) span.style.fontFamily = fontFamily;
    }

    // Put selection inside span
    span.appendChild(selected);
    range.insertNode(span);

    // Keep the selection expanded around the span for actions
    this.api.selection.expandToTag(span);
  }

  unwrap(parent: HTMLElement) {
    // Remove styles but keep inner text
    while (parent.firstChild) {
      parent.parentNode?.insertBefore(parent.firstChild, parent);
    }
    if (parent.parentNode) {
      // prevent text deselection
      this.api.selection.expandToTag(parent.parentNode as HTMLElement);
    }
    parent.remove();
  }

  surround(range: Range) {
    if (!range) return;

    // If already inside our styled <span>, unwrap it
    const parent = this.api.selection.findParentTag(
      "SPAN",
      TextStyleInlineTool.CSS
    );
    if (parent) {
      this.unwrap(parent);
      return;
    }
    // Otherwise, wrap selection in new span
    this.wrap(range);
  }

  applyStyleOnUserAction(style: "fontSize" | "fontFamily", value: string) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }
    const range = selection.getRangeAt(0);
    if (!range) return;

    // Check if selection is already inside our span
    let parent = this.api.selection.findParentTag(
      "SPAN",
      TextStyleInlineTool.CSS
    );

    if (!parent) {
      // Wrap in a span if not already
      const selected = range.extractContents();
      parent = document.createElement("span");
      parent.classList.add(TextStyleInlineTool.CSS);
      parent.appendChild(selected);
      range.insertNode(parent);
      this.api.selection.expandToTag(parent);
    }

    // Apply the new style
    if (style === "fontSize") parent.style.fontSize = value;
    if (style === "fontFamily") parent.style.fontFamily = value;
  }

  checkState(selection: Selection) {
    const state = this.detectStyle(selection);

    if (this.config.fontSizeEnabled) {
      const sizeDropdown = document.querySelector(
        "#text-style-font-size"
      ) as HTMLSelectElement;
      if (sizeDropdown) {
        sizeDropdown.value = state.fontSize || "";
      }
    }

    if (this.config.fontFamilyEnabled) {
      const familyDropdown = document.querySelector(
        "#text-style-font-family"
      ) as HTMLSelectElement;
      if (familyDropdown) {
        familyDropdown.value = state.fontFamily || "";
      }
    }
    const isActive = !!(state.fontSize || state.fontFamily);
    this.toggleActiveClass(isActive);
    return isActive;
  }

  private detectStyle(selection: Selection) {
    if (!selection || !selection.anchorNode)
      return { fontSize: null, fontFamily: null };

    let node: Node | null = selection.anchorNode;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    while (node && node instanceof HTMLElement) {
      const { fontSize, fontFamily } = node.style;
      if (fontSize || fontFamily) {
        return { fontSize: fontSize || null, fontFamily: fontFamily || null };
      }
      node = node.parentElement;
    }

    return { fontSize: null, fontFamily: null };
  }

  renderActions() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("cdx-text-style-actions");

    if (this.config.fontSizeEnabled) {
      const sizeSelect = document.createElement("select");
      sizeSelect.id = "text-style-font-size";
      sizeSelect?.addEventListener("change", (e) => {
        this.applyStyleOnUserAction(
          "fontSize",
          (e.target as HTMLSelectElement).value
        );
      });
      this.config.fontSizes!.forEach((size) => {
        const option = document.createElement("option");
        option.value = size.value;
        option.textContent = size.label;
        option.selected = size.value === this.config.defaultFontSize;
        sizeSelect.appendChild(option);
      });
      wrapper.appendChild(sizeSelect);
    }

    if (this.config.fontFamilyEnabled) {
      const familySelect = document.createElement("select");
      familySelect.id = "text-style-font-family";
      familySelect?.addEventListener("change", (e) => {
        this.applyStyleOnUserAction(
          "fontFamily",
          (e.target as HTMLSelectElement).value
        );
      });
      this.config.fontFamilies!.forEach((fam) => {
        const option = document.createElement("option");
        option.value = fam.value;
        option.textContent = fam.label;
        option.selected = fam.value === this.config.defaultFontFamily;
        familySelect.appendChild(option);
      });
      wrapper.appendChild(familySelect);
    }
    return wrapper;
  }

  static get sanitize() {
    return {
      span: {
        class: CSS,
        style: true,
      },
    };
  }
}

export interface TextStyleToolConfig {
  class: typeof TextStyleInlineTool;
  inlineToolbar?: boolean | string[];
  config?: TextStyleConfig;
}
