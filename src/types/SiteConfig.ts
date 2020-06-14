
export interface SiteConfig {
    /** Title that appears at the top of the header. */
    title: string;
    /** Introduction that appears under the title. */
    subtitle: string;
    /** Name that appears as the tab or window title. */
    meta: string;
    /** A URL pointing to the site logo. */
    logoUrl: string;
    /** A URL pointing to a favicon logo. */
    faviconUrl: string;
    /** A message that appears when an email is opened through a shared link. */
    autoOpenMessage: string;
    /**  */
    badMailtoMessage: string;
    /** The default subject line text. */
    defaultSubjectLine: string;
    /** The site footer pretext. */
    footerTextPr: string;
    /** Instructions on how to enter an issue request. */
    footerTextInstructions: string;
    /** Contact information for the community. */
    contactEmailFooter: string;
}
