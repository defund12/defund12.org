import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { DefundUtils } from "../../DefundUtils";
import { FooterProps } from "../../types/PropTypes";

/**
 * The site footer, containing issue request and contact information.
 *
 * _This is meant to be internal to this file and should
 * probably not be exported._
 */
class _Footer extends React.Component<FooterProps> {
  /**
   * Initialize the component.
   * @param {FooterProps} props
   */
  constructor(props: FooterProps) {
    super(props);
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render() {
    return (
      <>
        <aside className="sticky">
          <span
            dangerouslySetInnerHTML={{
              __html: DefundUtils.markdownToHTML(this.props.footerTextPr),
            }}
          ></span>
        </aside>
        <footer className="footerMain">
          <span
            dangerouslySetInnerHTML={{
              __html: DefundUtils.markdownToHTML(
                this.props.footerTextInstructions
              ),
            }}
          ></span>
          <span
            className="divider footer"
            dangerouslySetInnerHTML={{
              __html: DefundUtils.markdownToHTML(this.props.contactEmailFooter),
            }}
          ></span>
        </footer>
      </>
    );
  }
}

/**
 * The site footer, containing issue request and contact information.
 * @return {React.ReactNode}
 */
export default function Footer(): JSX.Element {
  return (
    <StaticQuery
      query={graphql`
        query FooterQuery {
          siteConfig {
            footerTextPr
            footerTextInstructions
            contactEmailFooter
          }
        }
      `}
      render={(data: { siteConfig: FooterProps }) => (
        <_Footer {...data.siteConfig} />
      )}
    />
  );
}
