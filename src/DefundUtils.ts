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
}