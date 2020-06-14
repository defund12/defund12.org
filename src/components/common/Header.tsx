import React from "react";
import { graphql, StaticQuery, Link } from "gatsby";
import { HeaderProps } from "../../types/PropTypes";

/**
 * The site header, containing the banner and introduction.
 *
 * _This is meant to be internal to this file and should
 * probably not be exported._
 */
class _Header extends React.Component<HeaderProps> {
  /**
    * React render method.
    * @return {React.ReactNode} the rendered component
    */
  render() {
    return (
      <header className="header">
        <Link to="/">
          <h1
            aria-label="Defund Twelve .org"
            className="pagetitle">
            { this.props.title }
          </h1>
        </Link>
        <p className="divider">{ this.props.subtitle }</p>
        <p aria-label="12 = Police"><i>"12" = </i>🚓</p>
      </header>
    );
  }
}

/**
 * The site header, containing the banner and introduction.
 * @return {JSX.Element}
 */
export default function Header(): JSX.Element {
  return (
    <StaticQuery query={graphql`
            query HeaderQuery {
                siteConfig {
                    title
                    subtitle
                }
            }
        `}
    render={(data: { siteConfig: HeaderProps }) =>
      <_Header
        title={data.siteConfig.title}
        subtitle={data.siteConfig.subtitle} />
    }/>
  );
}
