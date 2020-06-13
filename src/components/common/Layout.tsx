import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { LayoutProps } from "../../types/PropTypes";


/**
 * The site layout, which contains elements to place in <head> through React Helmet.
 */
export default class Layout extends React.Component<LayoutProps> {
    render() {
        return (
            <>
                <Helmet>
                    <title>{this.props.title}</title>
                    <meta charSet="utf-8" />
                    <meta name="description" content={this.props.meta} />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    <link rel="icon" type="image/svg+xml" href={this.props.faviconUrl} />

                    {/* Schema protocol */}
                    <meta itemProp="name" content={this.props.title } />
                    <meta itemProp="description" content={this.props.meta} />
                    <meta itemProp="image" content={this.props.logoUrl} />

                    {/*Facebook Open Graph protocol*/}
                    <meta property="og:title" content={this.props.title} />
                    <meta property="og:site_name" content={this.props.title} />
                    <meta property="og:description" content={this.props.meta} />
                    <meta property="og:image" content={this.props.logoUrl} />

                    {/* Twitter card protocol */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={this.props.title} />
                    <meta name="twitter:image" content={this.props.logoUrl} />
                    <meta name="twitter:description" content={this.props.meta} />

                    {/* CSS Includes */}
                    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />

                    {/* JS Includes */}
                    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossOrigin="anonymous"></script>
                </Helmet>
                <Header />
                    {this.props.children}
                <Footer />
            </>
        );
    }
}