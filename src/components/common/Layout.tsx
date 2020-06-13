import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { SiteConfig } from "../../types/SiteConfig";

interface LayoutProps {
    siteConfig: SiteConfig;
}

export default class Layout extends React.Component<LayoutProps> {
    render() {
        return (
            <>
                <Helmet>
                    <title>{this.props.siteConfig.title}</title>
                    <meta charSet="utf-8" />
                    <meta name="description" content={this.props.siteConfig.meta} />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    <link rel="icon" type="image/svg+xml" href={this.props.siteConfig.faviconUrl} />

                    {/* Schema protocol */}
                    <meta itemProp="name" content={this.props.siteConfig.title } />
                    <meta itemProp="description" content={this.props.siteConfig.meta} />
                    <meta itemProp="image" content={this.props.siteConfig.logoUrl} />

                    {/*Facebook Open Graph protocol*/}
                    <meta property="og:title" content={this.props.siteConfig.title} />
                    <meta property="og:site_name" content={this.props.siteConfig.title} />
                    <meta property="og:description" content={this.props.siteConfig.meta} />
                    <meta property="og:image" content={this.props.siteConfig.logoUrl} />

                    {/* Twitter card protocol */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={this.props.siteConfig.title} />
                    <meta name="twitter:image" content={this.props.siteConfig.logoUrl} />
                    <meta name="twitter:description" content={this.props.siteConfig.meta} />

                    {/* CSS Includes */}
                    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="/css/main.css" />

                    {/* JS Includes */}
                    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossOrigin="anonymous"></script>
                </Helmet>
                <Header />
                <div className="content">
                    <div className="container">
                        {this.props.children}
                        <Footer />
                    </div>
                </div>
            </>
        );
    }
}