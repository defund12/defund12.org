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
  /**
   * The layout of the template - email or letter
   */
  layout: "email" | "letter";
}

export interface BasicTemplateData extends EmailMetadata {
  /**
   * The email body as defined in markdown.
   */
  body: string;
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

export interface EmailData extends BasicTemplateData {
  /**
   * An array of recipients to send the email to.
   */
  recipients: Array<string>;
  /**
   * An array of recipients to cc on the email when sent.
   */
  cc: Array<string>;
}

export interface LetterData extends BasicTemplateData {
  /**
   * An array of offcials types to look up addresses for
   */
  officials: Array<string>;
}

type EmailDataType = EmailMetadata & EmailData;

/**
 * A node from remark containing either partial or full email data.
 */
export interface RemarkNode {
  frontmatter: EmailDataType;
}

/**
 * A type guard function that checks whether the object passed to it
 * is @link {EmailData}
 * @param {EmailDataType} emailDataOrMetadata the object to check.
 * @return {boolean}
 */
export function isEmailData(
  emailDataOrMetadata: EmailMetadata & EmailData
): emailDataOrMetadata is EmailData {
  if (Object.hasOwnProperty.call(emailDataOrMetadata, "body")) return true;
  return false;
}

/**
 * A group of email metadata for a specific state.
 */
export class EmailMetadataGroup {
  /**
   * Create an empty group.
   * @param name the state name.
   */
  constructor(name: string);
  /**
   * Create a group containing emails.
   * @param {string} name the state name.
   * @param {Array<EmailMetadata>} emails the state's emails.
   */
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
