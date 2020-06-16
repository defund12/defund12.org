import React from "react";
import { Helmet } from "react-helmet";
import { LayoutProps } from "../../types/PropTypes";
import Footer from "./Footer";
import Header from "./Header";

/**
 * The site layout, which contains elements to
 * place in <head> through React Helmet.
 */
export default class Layout extends React.Component<LayoutProps> {
  title: string;
  description: string;

  /**
   * Initialize the component and its state.
   * @param {LayoutProps} props
   */
  constructor(props: LayoutProps) {
    super(props);
    if (this.props.city) {
      this.title = this.props.city + " on Defund12.org";
      this.description = `Send a pre-written email directly to ${this.props.city}, ${this.props.state} officials`;
    } else {
      this.title = this.props.title;
      this.description = this.props.meta;
    }
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <>
        <Helmet>
          <title>{this.title}</title>
          <meta charSet="utf-8" />
          <meta name="description" content={this.description} />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link rel="icon" type="image/svg+xml" href={this.props.faviconUrl} />

          {/* Schema protocol */}
          <meta itemProp="name" content={this.title} />
          <meta itemProp="description" content={this.description} />
          <meta itemProp="image" content={this.props.logoUrl} />

          {/* Facebook Open Graph protocol*/}
          <meta property="og:title" content={this.title} />
          <meta property="og:site_name" content={this.props.title} />
          <meta property="og:description" content={this.description} />
          <meta property="og:image" content={this.props.logoUrl} />

          {/* Twitter card protocol */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={this.title} />
          <meta name="twitter:image" content={this.props.logoUrl} />
          <meta name="twitter:description" content={this.description} />

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
