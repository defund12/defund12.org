import unified from "unified";
import markdown from "remark-parse";
import breaks from "remark-breaks";
import rehype from "remark-rehype";
import sanitize from "rehype-sanitize";
import html from "rehype-stringify";

/**
 * Helper functions used throughout the site.
 */
export class DefundUtils {
  /**
   * Renders markdown to HTML using remark-html.
   * @param {string} value a markdown string to render to HTML.
   * @return {string} an HTML string
   */
  static markdownToHTML(value: string): string {
    return unified()
      .use(markdown)
      .use(breaks)
      .use(rehype)
      .use(sanitize)
      .use(html)
      .processSync(value)
      .toString();
  }

  /**
   * Temporarily creates a <textarea> in the browser and copies its content.
   * @param {string} copyText the text to copy.
   * @param {boolean} isPermalink a value indicating if the string is
   *   a permalink, and as such should have the root path prepended.
   */
  static copyToClipboard(copyText: string, isPermalink?: boolean): void {
    const element = document.createElement("textarea");
    let copyValue = copyText;
    if (isPermalink) {
      copyValue = "https://defund12.org".concat(copyText);
    }
    element.value = copyValue;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
  }
}
