import { SiteConfig } from "./SiteConfig"
import { EmailMetadataGroup, EmailData, EmailMetadata } from "./EmailData";

// {Page query result properties}
export interface SiteProps {
    data: {
        siteConfig: LayoutProps
    }
}

export interface EmailProps {
    data: {
        markdownRemark: {
            frontmatter: EmailData,
        },
        siteConfig: SiteConfig,
    }
}


// {Static query result properties}
export type LayoutProps = Pick<SiteConfig, 'title' | 'meta' | 'faviconUrl' | 'logoUrl'>;

export type HeaderProps = Pick<SiteConfig, "title" | "subtitle">;

export type FooterProps = Pick<SiteConfig, 'footer_text_pr' | 'footer_text_instructions' | 'contact_email_footer'>;


// {Component-provided properties}
export interface EmailListProps {
    /**
     * An array of tuples containing [state name, generated state ID, an array of emails].
     */
    stateGroupedEmails: Array<EmailMetadataGroup>;
}

export type EmailListItemProps = EmailMetadata;
