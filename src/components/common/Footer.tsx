import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { DefundUtils } from "../../DefundUtils";
import { FooterProps } from "../../types/PropTypes";

/**
 * The site footer, containing issue request and contact information.
 *
 * _This is meant to be internal to this file and should probably not be exported._
 */
class _Footer extends React.Component<FooterProps> {
  constructor(props: FooterProps) {
    super(props);
  }

  render() {
    return (
      <>
        <aside className="sticky">
          <p dangerouslySetInnerHTML={ { __html: DefundUtils.markdownToHTML(this.props.footer_text_pr) } }></p>
        </aside>
        <footer className="footerMain">
          <p dangerouslySetInnerHTML={ { __html: DefundUtils.markdownToHTML(this.props.footer_text_instructions) } }></p>
          <p className="divider footer" dangerouslySetInnerHTML={ { __html: DefundUtils.markdownToHTML(this.props.contact_email_footer) } }></p>
        </footer>
      </>
    );
  }
}

/**
 * The site footer, containing issue request and contact information.
 */
export default function Footer() {
  return (
    <StaticQuery query={graphql`
            query FooterQuery {
                siteConfig {
                    footer_text_pr
                    footer_text_instructions
                    contact_email_footer
                }
            }`
    }
    render={(data: {siteConfig: FooterProps}) =>
      <_Footer {...data.siteConfig} />}
    />
  );
}
