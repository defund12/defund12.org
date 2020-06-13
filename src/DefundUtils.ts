import remark from "remark";
import remarkHTML from 'remark-html';

export class DefundUtils {
    /**
     * Renders markdown to HTML using remark-html.
     * @param value a markdown string to render to HTML.
     */
    static markdownToHTML(value: string) {
        return remark()
        .use(remarkHTML)
        .processSync(value)
        .toString()
    }

    static copyToClipboard(copyText: string, isPermalink?: boolean) {
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