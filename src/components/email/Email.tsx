import React from "react";
import { graphql } from "gatsby";
import Layout from "../common/Layout";
import EmailList from "../email-list/EmailList";
import { DefundUtils } from "../../DefundUtils";
import { EmailProps } from "../../types/PropTypes";


/**
 * A rendered email, containing links to send or copy.
 */
export default class Email extends React.Component<EmailProps> {
    render() {
        const { markdownRemark, siteConfig } = this.props.data;
        const emailData = markdownRemark.frontmatter;
        return (
            <Layout {...siteConfig}>
                <section className="emailPageHeader">
                    <h2>{ emailData.name }</h2>
                    <b>{ emailData.city }, { emailData.state }</b>
                    <p id="autoopen">{ siteConfig.auto_open_message }</p>
                    <div className='buttons'>
                        <a>Send email</a>&nbsp;
                        <a>Copy link</a>
                    </div>
                    <p>{ siteConfig.bad_mailto_message }</p>
                </section>

                <article className="emailContentSection">
                    <div className="container">
                        <div className="emailContent">
                            <div className="recipients">
                                <b>To:</b> <span className="copyToClipboard">🔗</span>&nbsp;
                                {emailData.recipients.join(', ')}
                            </div>

                            {(emailData.cc ? 
                            <div className="recipients">
                                <b>CC:</b> <span className="copyToClipboard">🔗</span>&nbsp;
                                {emailData.cc.join(', ')}
                            </div> 
                            : undefined)}
                            
                            <div className="recipients">
                                <b>Subject:</b> { siteConfig.default_subject_line }
                            </div>
                            <div>
                                <b>Message:</b> <i>(Don't forget to replace the [x]'s with your information!)</i>&nbsp;
                                <span className="copyToClipboard">🔗</span>
                                <span dangerouslySetInnerHTML={{__html: DefundUtils.markdownToHTML(emailData.body)}}></span>
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