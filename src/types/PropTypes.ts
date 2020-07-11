import { SiteConfig } from "./SiteConfig";
import {
  TemplateMetadataGroup,
  EmailData,
  SharedTemplateMetadata,
  LetterData,
  PhoneScriptData,
} from "./TemplateData";

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

export type LetterConfig = Pick<
  SiteConfig,
  | "siteTitle"
  | "meta"
  | "logoUrl"
  | "faviconUrl"
  | "letterPageHeader"
  | "googleApiKey"
>;

export type LettersPageConfig = Pick<SiteConfig, "letterPageHeader">;

export interface LetterProps {
  markdownRemark: {
    frontmatter: LetterData;
  };
  siteConfig: LetterConfig;
}

export type PhoneScriptConfig = Pick<
  SiteConfig,
  | "siteTitle"
  | "meta"
  | "logoUrl"
  | "faviconUrl"
  | "phonePageHeader"
  | "googleApiKey"
>;

export type PhonePageConfig = Pick<SiteConfig, "phonePageHeader">;

export interface PhoneScriptProps {
  markdownRemark: {
    frontmatter: PhoneScriptData;
  };
  siteConfig: PhoneScriptConfig;
}

export interface OptionalLayoutProps {
  pageTitle?: string;
  meta?: string;
  metaQueryString?: string;
  layout?: string;
}

// {Static query result properties}
export type LayoutProps = Pick<
  SiteConfig,
  | "siteTitle"
  | "meta"
  | "faviconUrl"
  | "logoUrl"
  | "metaPreviewUrl"
  | "googleApiKey"
  | "letterPageHeader"
> &
  OptionalLayoutProps;

export type HeaderProps = Pick<SiteConfig, "siteTitle" | "subtitle">;

export type FooterProps = Pick<
  SiteConfig,
  "footerTextPr" | "footerTextInstructions" | "contactEmailFooter"
>;

// {Component-provided properties}
export interface TemplateListProps {
  /**
   * An array of tuples containing [state name,
   * generated state ID, an array of email/letter templates].
   */
  stateGroupedTemplates: Array<TemplateMetadataGroup>;
}

export type TemplateListItemProps = SharedTemplateMetadata;
