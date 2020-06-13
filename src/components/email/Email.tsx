import React from "react";
import { graphql } from "gatsby";
import Layout from "../common/Layout";
import EmailList from "../email-list/EmailList";
import { EmailData } from "../../types/EmailData";
import { SiteConfig } from "../../types/SiteConfig";

interface EmailProps {
    data: {
        markdownRemark: {
            frontmatter: EmailData,
        },
        siteConfig: SiteConfig,
    }
}

export default class Email extends React.Component<EmailProps> {
    render() {
        const { markdownRemark, siteConfig } = this.props.data;
        const { frontmatter } = markdownRemark;
        return (
            <Layout siteConfig={siteConfig}>
                <div className="content emailPageHeader">
                    <div className="container">
                        <h2>{ frontmatter.name }</h2>
                        <b>{ frontmatter.city }, { frontmatter.state }</b><br />
                        <p id="autoopen">{ siteConfig.auto_open_message }</p>
                        <div className='buttons'>
                            <a>Send email</a>
                            <a>Copy link</a>
                        </div>
                        <p>{ siteConfig.bad_mailto_message }</p>
                    </div>
                </div>

                <div className="content emailContentSection">
                    <div className="container">
                        <div className="emailContent">
                            <div className="recipients">
                                <b>To:</b> <span className="copyToClipboard">🔗</span>
                                {frontmatter.recipients.join(',')}
                            </div>

                            {(frontmatter.cc ? 
                            <div className="recipients">
                                <b>CC:</b> <span className="copyToClipboard">🔗</span>
                                {frontmatter.cc.join(',')}
                            </div> 
                            : undefined)}
                            
                            <div className="recipients">
                                <b>Subject:</b> { siteConfig.default_subject_line }
                            </div>
                            <div>
                                <b>Message:</b> <i>(Don't forget to replace the [x]'s with your information!)</i>
                                <span className="copyToClipboard">🔗</span>
                                <br /> {frontmatter.body}
                            </div>
                        </div>
                    </div>
                </div>
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
          contact_email_footer
          footer_text
          logoUrl
          faviconUrl
          auto_open_message
          bad_mailto_message
          default_subject_line
        }
    }
`;