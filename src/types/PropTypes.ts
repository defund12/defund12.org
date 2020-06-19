import { SiteConfig } from "./SiteConfig";
import { EmailMetadataGroup, EmailData, EmailMetadata } from "./EmailData";

// {Page query result properties}
export interface SiteProps {
  siteConfig: LayoutProps;
}

export type EmailConfig = Pick<
  SiteConfig,
  | "siteTitle"
  | "meta"
  | "logoUrl"
  | "faviconUrl"
  | "autoOpenMessage"
  | "badMailtoMessage"
  | "defaultSubjectLine"
>;

export interface EmailProps {
  markdownRemark: {
    frontmatter: EmailData;
  };
  siteConfig: EmailConfig;
}

export interface OptionalLayoutProps {
  pageTitle?: string;
  meta?: string;
  metaQueryString?: string;
}

// {Static query result properties}
export type LayoutProps = Pick<
  SiteConfig,
  "siteTitle" | "meta" | "faviconUrl" | "logoUrl" | "metaPreviewUrl"
> &
  OptionalLayoutProps;

export type HeaderProps = Pick<SiteConfig, "siteTitle" | "subtitle">;

export type FooterProps = Pick<
  SiteConfig,
  "footerTextPr" | "footerTextInstructions" | "contactEmailFooter"
>;

// {Component-provided properties}
export interface EmailListProps {
  /**
   * An array of tuples containing [state name,
   * generated state ID, an array of emails].
   */
  stateGroupedEmails: Array<EmailMetadataGroup>;
}

export type EmailListItemProps = EmailMetadata;
