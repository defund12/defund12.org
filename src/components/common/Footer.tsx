import React from 'react';
import remark from 'remark';
import { StaticQuery, graphql } from 'gatsby';
import remarkHTML from 'remark-html';

interface FooterProps {
    footerText: string;
    contactEmailFooter: string;
}


class _Footer extends React.Component<FooterProps> {
    constructor(props: FooterProps) {
        super(props);
    }
    
    markdownToHTML(value: string) {
        return remark()
        .use(remarkHTML)
        .processSync(value)
        .toString()
    }

    render() {
        return (
            <>
                <p className="divider footer" dangerouslySetInnerHTML={ { __html: this.markdownToHTML(this.props.footerText) } }></p>
                <p className="divider footer" dangerouslySetInnerHTML={ { __html: this.markdownToHTML(this.props.contactEmailFooter) } }></p>
            </>
        );
    }
}

export default function Footer() {
    return (
        <StaticQuery query={graphql`
            query FooterQuery {
                yaml {
                    footer_text
                    contact_email_footer
                }
            }`
        }
        render={(data: any) => <_Footer footerText={data.yaml.footer_text} contactEmailFooter={data.yaml.contact_email_footer}/>}
        />
    );
}
