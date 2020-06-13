
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
    auto_open_message: string;
    /**  */
    bad_mailto_message: string;
    /** The default subject line text. */
    default_subject_line: string;
    /** The site footer pretext. */
    footer_text_pr: string;
    /** Instructions on how to enter an issue request. */
    footer_text_instructions: string;
    /** Contact information for the community. */
    contact_email_footer: string;
}
