import { graphql, PageProps } from "gatsby";
import * as queryString from "query-string";
import React from "react";
import { DefundUtils } from "../../DefundUtils";
import { EmailData } from "../../types/TemplateData";
import {
  EmailConfig,
  EmailProps,
  OptionalLayoutProps,
} from "../../types/PropTypes";
import Layout from "../common/Layout";
import EmailList from "../template-list/EmailList";
import styled from "@emotion/styled";

/**
 * The @link {Email} component state.
 */
class EmailState {
  recipientsCopied = false;
  ccCopied = false;
  bodyCopied = false;
}

/**
 * A rendered email, containing links to send or copy.
 */
export default class Email extends React.Component<
  PageProps<EmailProps>,
  EmailState
> {
  siteConfig: EmailConfig;
  emailData: EmailData;
  layoutProps: OptionalLayoutProps;
  autoOpen = false;

  /**
   * Initialize the component and its state.
   * @param {PageProps<EmailProps>} props
   */
  constructor(props: PageProps<EmailProps>) {
    super(props);
    this.siteConfig = this.props.data.siteConfig;
    this.emailData = this.props.data.markdownRemark.frontmatter;
    this.layoutProps = {
      pageTitle: `Defund12 in ${this.emailData.city}, ${this.emailData.state}`,
      meta: `Send a pre-written email directly to ${this.emailData.city}, ${this.emailData.state} officials`,
      metaQueryString: queryString.stringify({
        state: this.emailData.state,
        city: this.emailData.city,
      }),
      layout: "email",
    };
    this.state = new EmailState();
  }

  /**
   * React client-side mount method.
   */
  componentDidMount(): void {
    const isAndroid = /(android)/i.test(navigator.userAgent);
    if (isAndroid) {
      this.emailData.body = this.emailData.body.replace("\n", "<br/>");
    }
    const queryParams = queryString.parse(this.props.location.search);
    if ("browse" in queryParams) {
      // Automatically updates the URL so
      // if folks try to share, it will auto-open
      const pathWithoutQuery = `${this.props.location.origin}${this.props.location.pathname}`;
      window.history.replaceState({}, document.title, pathWithoutQuery);
    } else {
      this.autoOpen = true;
      this.openEmail();
    }
  }

  /**
   * Redirects the browser to a mailto: link containing the email information
   */
  openEmail(): void {
    const subject = encodeURIComponent(
      this.siteConfig.defaultSubjectLine.trim()
    );
    const body = encodeURIComponent(this.emailData.body.trim());
    const recipients = this.emailData.recipients;
    const cc = this.emailData.cc || [];
    const bcc = recipients.concat(cc);
    window.location.href = `mailto:?bcc=${bcc.join(
      ","
    )}&subject=${subject}&body=${body}`;
  }

  /**
   * Updates the component state to reflect which element was clicked.
   * @param {Pick<EmailState, K>} statePatch an object containing
   *   the state update to apply
   * @param {string} copy the text to copy to the user's clipboard.
   */
  handleClipboardCopy<K extends keyof EmailState>(
    statePatch: Pick<EmailState, K>,
    copy: string
  ): void {
    this.setState(statePatch);
    DefundUtils.copyToClipboard(copy);
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <Layout {...this.layoutProps}>
        <StyledSection>
          <h2>{this.emailData.name}</h2>
          <b>
            {this.emailData.city}, {this.emailData.state}
          </b>
          <p hidden={!this.autoOpen}>{this.siteConfig.autoOpenMessage}</p>
          <div className="buttons">
            <a onClick={this.openEmail.bind(this)}>Send email</a>
            <a
              onClick={() =>
                DefundUtils.copyToClipboard(this.emailData.permalink, true)
              }
            >
              Copy link
            </a>
          </div>
          <p>{this.siteConfig.badMailtoMessage}</p>
        </StyledSection>

        <StyledArticle>
          <div className="container">
            <div className="emailContent">
              <div className="recipients">
                <b>To:</b>
                <span
                  className="copyToClipboard"
                  onClick={() =>
                    this.handleClipboardCopy(
                      { recipientsCopied: true },
                      this.emailData.recipients.join(", ")
                    )
                  }
                >
                  {this.state.recipientsCopied ? "✅(copied)" : "🔗"}
                </span>
                &nbsp;
                {this.emailData.recipients.join(", ")}
              </div>

              {this.emailData.cc ? (
                <div className="recipients">
                  <b>CC:</b>
                  <span
                    className="copyToClipboard"
                    onClick={() =>
                      this.handleClipboardCopy(
                        { ccCopied: true },
                        this.emailData.cc.join(", ")
                      )
                    }
                  >
                    {this.state.ccCopied ? "✅(copied)" : "🔗"}
                  </span>
                  &nbsp;
                  {this.emailData.cc.join(", ")}
                </div>
              ) : undefined}

              <div className="recipients">
                <b>Subject:</b> {this.siteConfig.defaultSubjectLine}
              </div>
              <div>
                <b>Message:</b>&nbsp;
                <i>
                  (Don't forget to replace the [x]'s with your information!)
                </i>
                <span
                  className="copyToClipboard"
                  onClick={() =>
                    this.handleClipboardCopy(
                      { bodyCopied: true },
                      this.emailData.body
                    )
                  }
                >
                  {this.state.bodyCopied ? "✅(copied)" : "🔗"}
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: DefundUtils.markdownToHTML(this.emailData.body),
                  }}
                ></span>
              </div>
            </div>
          </div>
        </StyledArticle>
        <EmailList />
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query($permalink: String!) {
    markdownRemark(
      frontmatter: { permalink: { eq: $permalink }, layout: { eq: "email" } }
    ) {
      frontmatter {
        body
        cc
        city
        country
        date
        name
        state
        permalink
        recipients
      }
    }
    siteConfig {
      autoOpenMessage
      badMailtoMessage
      defaultSubjectLine
    }
  }
`;

const StyledSection = styled.section`
  width: calc(100vw - var(--x8));
  max-width: var(--m);
  padding-bottom: var(--x4);

  b {
    display: block;
    margin-bottom: var(--x2);
  }

  .buttons {
    margin: var(--x3) 0;

    a {
      display: inline-block;
      color: var(--link);
      cursor: pointer;

      &:not(:last-child) {
        margin-right: var(--x2);
      }
    }
  }
`;

const StyledArticle = styled.article`
  padding: var(--x4) 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg_);

  .container {
    width: calc(100vw - var(--x8));
    max-width: var(--m);
    .emailContent {
      div {
        margin-top: var(--x3);
      }

      .recipients {
        overflow-wrap: break-word;
      }
    }
  }
`;
