import React from "react";
import { Helmet } from "react-helmet";
import { LayoutProps } from "../../types/PropTypes";
import { graphql, StaticQuery } from "gatsby";
import Footer from "./Footer";
import Header from "./Header";

/**
 * The site layout, which contains elements to
 * place in <head> through React Helmet.
 * _This is meant to be internal to this file and should
 * probably not be exported._
 */
class _Layout extends React.Component<LayoutProps> {
  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <>
        <Helmet>
          <title>{this.props.pageTitle}</title>
          <meta charSet="utf-8" />
          <meta name="description" content={this.props.meta} />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link rel="icon" type="image/svg+xml" href={this.props.faviconUrl} />

          {/* Schema protocol */}
          <meta itemProp="name" content={this.props.pageTitle} />
          <meta itemProp="description" content={this.props.meta} />
          <meta itemProp="image" content={this.props.logoUrl} />

          {/* Facebook Open Graph protocol*/}
          <meta property="og:title" content={this.props.pageTitle} />
          <meta property="og:site_name" content={this.props.siteTitle} />
          <meta property="og:description" content={this.props.meta} />
          <meta property="og:image" content={this.props.logoUrl} />

          {/* Twitter card protocol */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={this.props.pageTitle} />
          <meta name="twitter:image" content={this.props.logoUrl} />
          <meta name="twitter:description" content={this.props.meta} />

          {/* CSS Includes */}
          {/* eslint-disable-next-line max-len*/}
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&display=swap"
            rel="stylesheet"
          />

          {/* JS Includes */}
          {/* eslint-disable-next-line max-len*/}
        </Helmet>
        <Header />
        {this.props.children}
        <Footer />
      </>
    );
  }
}

/**
 * The site layout, which contains elements to
 * place in <head> through React Helmet.
 * @param {any} props
 *    pass in child elements and optionally, pageTitle and meta
 * @return {JSX.Element}
 */
export default function Layout(props: any): JSX.Element {
  return (
    <StaticQuery
      query={graphql`
        query LayoutQuery {
          siteConfig {
            siteTitle
            meta
            logoUrl
            faviconUrl
          }
        }
      `}
      render={(data: { siteConfig: LayoutProps }) => (
        <_Layout
          siteTitle={data.siteConfig.siteTitle}
          pageTitle={
            props.pageTitle ? props.pageTitle : data.siteConfig.siteTitle
          }
          meta={props.meta ? props.meta : data.siteConfig.meta}
          logoUrl={data.siteConfig.logoUrl}
          faviconUrl={data.siteConfig.faviconUrl}
        >
          {props.children}
        </_Layout>
      )}
    />
  );
}
