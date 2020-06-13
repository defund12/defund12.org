import React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../common/Layout";
import EmailList from "../email-list/EmailList";
import { DefundUtils } from "../../DefundUtils";
import { EmailProps, EmailConfig } from "../../types/PropTypes";
import { EmailData } from "../../types/EmailData";
import * as queryString from "query-string";

class EmailState {
    recipientsCopied: boolean = false;
    ccCopied: boolean = false;
    bodyCopied: boolean = false;
}

/**
 * A rendered email, containing links to send or copy.
 */
export default class Email extends React.Component<PageProps<EmailProps>, EmailState> {
    siteConfig: EmailConfig;
    emailData: EmailData;
    autoOpen: boolean = false;

    constructor(props: PageProps<EmailProps>) {
      super(props);
      this.siteConfig = this.props.data.siteConfig;
      this.emailData = this.props.data.markdownRemark.frontmatter;
      // const isAndroid = /(android)/i.test(navigator.userAgent);
      // if (isAndroid) this.emailData.body = this.emailData.body.replace('\n', "<br/>");
      const queryParams = queryString.parse(this.props.location.search);
      if ("browse" in queryParams) {
        // Automatically updates the URL so if folks try to share, it will auto-open
        // this.props.uri.replaceState({}, document.title, `${this.props.location.origin}${this.props.location.pathname}`)
      } else {
        this.autoOpen = true;
        this.openEmail();
      }

      this.state = new EmailState();
    }

    openEmail() {
      const subject = encodeURIComponent(this.siteConfig.default_subject_line.trim());
      const body = encodeURIComponent(this.emailData.body.trim());
      const recipients = this.emailData.recipients.join(", ");
      const cc = this.emailData.cc?.join(", ");
      const ccText = cc != null && cc.length > 0 ? `cc=${cc}&` : "";
      // window.location.href = `mailto:${recipients}?${ccText}subject=${subject}&body=${body}`;
    }

    handleClipboardCopy<K extends keyof EmailState>(statePatch: Pick<EmailState, K>, copy: string) {
      this.setState(statePatch);
      DefundUtils.copyToClipboard(copy);
    }

    render() {
      return (
        <Layout {...this.siteConfig}>
          <section className="emailPageHeader">
            <h2>{ this.emailData.name }</h2>
            <b>{ this.emailData.city }, { this.emailData.state }</b>
            <p hidden={!this.autoOpen}>{ this.siteConfig.auto_open_message }</p>
            <div className='buttons'>
              <a onClick={this.openEmail.bind(this)}>Send email</a>&nbsp;
              <a onClick={() => DefundUtils.copyToClipboard(this.emailData.permalink, true)}>Copy link</a>
            </div>
            <p>{ this.siteConfig.bad_mailto_message }</p>
          </section>

          <article className="emailContentSection">
            <div className="container">
              <div className="emailContent">
                <div className="recipients">
                  <b>To:</b>
                  <span className="copyToClipboard"
                    onClick={() => this.handleClipboardCopy({ recipientsCopied: true }, this.emailData.recipients.join(", "))}>
                    {(this.state.recipientsCopied ? "✅(copied)" : "🔗")}
                  </span>&nbsp;
                  {this.emailData.recipients.join(", ")}
                </div>

                {(this.emailData.cc ?
                            <div className="recipients">
                              <b>CC:</b>
                              <span className="copyToClipboard"
                                onClick={() => this.handleClipboardCopy({ ccCopied: true }, this.emailData.cc.join(", "))}>
                                {(this.state.ccCopied ? "✅(copied)" : "🔗")}
                              </span>&nbsp;
                              {this.emailData.cc.join(", ")}
                            </div> :
                            undefined)}

                <div className="recipients">
                  <b>Subject:</b> { this.siteConfig.default_subject_line }
                </div>
                <div>
                  <b>Message:</b> <i>(Don't forget to replace the [x]'s with your information!)</i>
                  <span className="copyToClipboard"
                    onClick={() => this.handleClipboardCopy({ bodyCopied: true }, this.emailData.body)}>
                    {(this.state.bodyCopied ? "✅(copied)" : "🔗")}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: DefundUtils.markdownToHTML(this.emailData.body) }}></span>
                </div>
              </div>
            </div>
          </article>
          <EmailList />
        </Layout>
      );
    }
}

export const pageQuery = graphql`
    query($permalink: String!) {
        markdownRemark(frontmatter:{permalink: { eq: $permalink } }) {
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
          title
          meta
          logoUrl
          faviconUrl
          auto_open_message
          bad_mailto_message
          default_subject_line
        }
    }
`;
