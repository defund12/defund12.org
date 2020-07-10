import React from "react";
import { Helmet } from "react-helmet";
import { LayoutProps, OptionalLayoutProps } from "../../types/PropTypes";
import { graphql, StaticQuery } from "gatsby";
import Footer from "./Footer";
import Header from "./Header";
import { injectGlobal } from "emotion";
import emotionReset from "emotion-reset";

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

          {/* Google Maps - for geocoding letter addresses */}
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${this.props.googleApiKey}&libraries=places`}
          ></script>
        </Helmet>
        <Header />
        {this.props.children}
        <Footer />
      </>
    );
  }
}

// todo: add separate template for email and for index/404 so prop types are more clearly defined
/**
 * The site layout, which contains elements to
 * place in <head> through React Helmet.
 * @param {OptionalLayoutProps} props
 *    pass in child elements, page title, and meta
 * @return {JSX.Element}
 */
export default function Layout(
  props: React.PropsWithChildren<OptionalLayoutProps>
): JSX.Element {
  return (
    <StaticQuery
      query={graphql`
        query LayoutQuery {
          siteConfig {
            siteTitle
            meta
            logoUrl
            faviconUrl
            metaPreviewUrl
            googleApiKey
          }
        }
      `}
      render={(data: { siteConfig: LayoutProps }) => (
        <_Layout
          {...data.siteConfig}
          pageTitle={
            props.pageTitle ? props.pageTitle : data.siteConfig.siteTitle
          }
          meta={props.meta ? props.meta : data.siteConfig.meta}
          logoUrl={
            props.metaQueryString
              ? data.siteConfig.metaPreviewUrl +
                props.layout +
                "?" +
                props.metaQueryString
              : data.siteConfig.logoUrl
          }
        >
          {props.children}
        </_Layout>
      )}
    />
  );
}

injectGlobal`
  ${emotionReset}

 /* Colors ======================================================= */
:root {
  --beta: hsl(137, 23%, 50%);
  --beta-text: hsl(0, 0%, 98%);
  --text: hsl(0, 0%, 13%);
  --text_subtle: hsl(0, 0%, 60%);
  --subtle: hsl(0, 0%, 87%);
  --subtle_: hsl(0, 0%, 67%);
  --link: hsl(240, 100%, 50%);
  --link_subtle: hsl(217, 26%, 74%);
  --bg: hsl(0, 0%, 100%);
  --bg_: hsl(0, 0%, 96%);
  --bg__: hsl(0, 0%, 100%);
  --transparent: hsla(0, 0%, 100%, 0);
  --emojicon-city: "🏙";

  @media (prefers-color-scheme: dark) {
    --text: hsl(0, 0%, 87%);
    --text_subtle: hsl(0, 0%, 40%);
    --subtle: hsl(0, 0%, 21%);
    --subtle_: hsl(0, 0%, 33%);
    --link: hsl(218, 94%, 61%);
    --link_subtle: hsl(218, 26%, 35%);
    --bg: hsl(0, 0%, 7%);
    --bg_: hsl(0, 0%, 9%);
    --bg__: hsl(0, 0%, 13%);
    --transparent: hsla(0, 0%, 0%, 0);
    --highlight_block: hsl(218, 26%, 35%);
    --beta-text: hsl(0, 0%, 93%);
    --emojicon-city: "🌃";
  }

  --x1: 0.5rem;
  --x2: 1rem;
  --x3: 1.5rem;
  --x4: 2rem;
  --x5: 2.5rem;
  --x6: 3rem;
  --x7: 3.5rem;
  --x8: 4rem;

  --xs: 20rem;
  --s: 30rem;
  --m: 45rem;
  --l: 48rem;
  --xl: 64rem;

}

  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -moz-font-feature-settings: "kern", "liga", "clig", "calt";
    -ms-font-feature-settings: "kern", "liga", "clig", "calt";
    -webkit-font-feature-settings: "kern", "liga", "clig", "calt";
    font-feature-settings: "kern", "liga", "clig", "calt";
    background-color: var(--bg);
    font-family: "Source Code Pro", "Helvetica", "Arial", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text);
  }

  a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid var(--link_subtle);

    &:hover {
      border-color: var(--text_subtle);
    }

    &:focus {
      outline: none;
      border-bottom: 1px solid var(--text_subtle);
    }
  }

  em,
  i {
    font-weight: 400;
    font-style: italic;
  }

  b,
  strong {
    font-weight: 700;
  }

  h1 {
    font-weight: 700;
    font-size: 36px;
    line-height: 1.2;

    @include breakpoint(s) {
      font-size: 30px;
    }
  }

  h2 {
    font-size: 24px;
    line-height: 1.2;
    font-weight: 400;
    margin-top: var(--x2);

    @include breakpoint(s) {
      font-size: 22px;
    }
  }

  ul, ol {
    list-style: inherit;
    margin: 0 0 var(--x2) var(--x2);
    li {
      text-indent: 0;
      display: list-item;
      margin: var(--x1) 0;
    }
  }

  header,
  footer {
    width: calc(100vw - var(--x8));
    max-width: var(--m);
  }

  p {
    max-width: 580px;
    margin-bottom: var(--x2);
  }

  p.divider {
    &:before {
      content: "";
      display: block;
      width: var(--x6);
      border-bottom: 1px solid var(--link_subtle);
      margin: var(--x2) 0 var(--x3);
      max-width: 720px;
    }

    line-height: 1.6;
    margin-bottom: var(--x2);
  }

  #___gatsby,
  #gatsby-focus-wrapper {
    display: contents;
  }
`;
