export type LayoutType = "email" | "letter" | "phone";
/**
 * The top-level data of a template (email or letter).
 */
export interface SharedTemplateMetadata {
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
  layout: LayoutType;
}

/** The full data used to render a template */
export interface SharedTemplateData extends SharedTemplateMetadata {
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

/** The full type of an email template from markdown */
export interface EmailData extends SharedTemplateData {
  /**
   * An array of recipients to send the email to.
   */
  recipients: Array<string>;
  /**
   * An array of recipients to cc on the email when sent.
   */
  cc: Array<string>;

  /** an email! */
  layout: "email";
}

/** The full type of a letter template from markdown */
export interface LetterData extends SharedTemplateData {
  /**
   * An array of offcials types to look up addresses for
   */
  officials: Array<string>;

  /** a letter! */
  layout: "letter";
}

/**
 * Contact information for a call script
 */
export interface PhoneScriptContact {
  /** The contact's name */
  name: string;
  /** The contact's phone number */
  number: string;
}

/**
 * The full type of a phone script from markdown
 */
export interface PhoneScriptData extends SharedTemplateData {
  /** An array of officials' names and phone numbers to call using this script */
  contacts: Array<PhoneScriptContact>;
  /** a phone script! */
  layout: "phone";
}

// type EmailDataType = TemplateMetadata & EmailData;

/**
 * A node from remark containing either partial or full email data.
 */
export interface RemarkNode {
  frontmatter: EmailData;
}

/**
 * A type guard function that checks whether the object passed to it
 * is @link {EmailData}
 * @param {EmailDataType} emailDataOrMetadata the object to check.
 * @return {boolean}
 */
export function isEmailData(
  emailDataOrMetadata: SharedTemplateMetadata & EmailData
): emailDataOrMetadata is EmailData {
  if (Object.hasOwnProperty.call(emailDataOrMetadata, "body")) return true;
  return false;
}

/**
 * A group of email metadata for a specific state.
 */
export class TemplateMetadataGroup {
  /**
   * Create an empty group.
   * @param name the state name.
   */
  constructor(name: string);
  /**
   * Create a group containing emails.
   * @param {string} name the state name.
   * @param {Array<SharedTemplateMetadata>} templates the state's emails.
   */
  constructor(name: string, templates: Array<SharedTemplateMetadata> = []) {
    this.name = name;
    this.templates = templates;
  }
  /** The state name. */
  name: string;
  /** An unambiguous identifier for the state, generated at render-time. */
  id?: number;
  /** An array of template metadata belonging to the state. */
  templates: Array<SharedTemplateMetadata>;
}
