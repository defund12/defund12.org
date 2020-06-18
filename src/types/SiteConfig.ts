export interface SiteConfig {
  /** Title that appears at the top of the header. */
  siteTitle: string;
  /** Introduction that appears under the title. */
  subtitle: string;
  /** Name that appears as the tab or window title. */
  meta: string;
  /** A URL pointing to the site logo. */
  logoUrl: string;
  /** A URL pointing to a favicon logo. */
  faviconUrl: string;
  /** A URL pointing to the meta preview image generation API. */
  metaPreviewUrl: string;
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
  /** A message that appears before the physical letter mailing form */
  letterMessage: string;
  /** Google API key with Maps and Civic Info perms */
  googleApiKey: string;
}
