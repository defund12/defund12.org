
/**
 * The top-level data of an email.
 */
export interface EmailMetadata {
    /**
     * The link to the email page (e.g. "/anchorage")
     */
    permalink: string;
    /**
     * The name of the email, as defined in markdown.
     */
    name: string;
    /**
     * The city the email belongs to.
     */
    city: string;
    /**
     * The state that the email's city is in.
     */
    state: string;
}

export interface EmailData extends EmailMetadata {
    /**
     * The email body as defined in markdown.
     */
    body: string;
    /**
     * An array of recipients to send the email to.
     */
    recipients: Array<string>
    /**
     * An array of recipients to cc on the email when sent.
     */
    cc: Array<string>;
    /**
     * The country the email's region is in.
     * 
     * _(Reserved for future use.)_
     */
    country: never & string;
    /**
     * The email's expiration date.
     * 
     * _(Reserved for future use.)_
     */
    date: never & Date;
}

/**
 * A node from remark containing either partial or full email data.
 */
export interface RemarkNode {
    frontmatter: EmailMetadata & EmailData;
}

export function isEmailData(emailDataOrMetadata: EmailMetadata & EmailData): emailDataOrMetadata is EmailData {
    if (emailDataOrMetadata.hasOwnProperty('body')) return true;
    return false;
}

/**
 * A group of email metadata for a specific state.
 */
export class EmailMetadataGroup {
    constructor(name: string)
    constructor(name: string, emails: Array<EmailMetadata> = []) {
        this.name = name;
        this.emails = emails;
    }
    /** The state name. */
    name: string;
    /** An unambiguous identifier for the state, generated at render-time. */
    id?: number;
    /** An array of email metadata belonging to the state. */
    emails: Array<EmailMetadata>;
}