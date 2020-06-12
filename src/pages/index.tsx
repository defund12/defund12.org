import React from 'react'
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import Layout from '../components/common/Layout';
import EmailList from '../components/email-list/EmailList';

import '../../css/main.scss';

interface SiteInfo {
    title: string,
    meta: string,
    logoUrl: string,
    faviconUrl: string
}

interface SiteProps {
    data: {
        defund12Yaml: SiteInfo
    }
}

export default class Index extends React.Component<SiteProps> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>{this.props.data.defund12Yaml.title}</title>
                    <meta charSet="utf-8" />
                    <meta name="description" content={this.props.data.defund12Yaml.meta} />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    <link rel="icon" type="image/svg+xml" href={this.props.data.defund12Yaml.faviconUrl} />

                    {/* Schema protocol */}
                    <meta itemProp="name" content={this.props.data.defund12Yaml.title } />
                    <meta itemProp="description" content={this.props.data.defund12Yaml.meta} />
                    <meta itemProp="image" content={this.props.data.defund12Yaml.logoUrl} />

                    {/*Facebook Open Graph protocol*/}
                    <meta property="og:title" content={this.props.data.defund12Yaml.title} />
                    <meta property="og:site_name" content={this.props.data.defund12Yaml.title} />
                    <meta property="og:description" content={this.props.data.defund12Yaml.meta} />
                    <meta property="og:image" content={this.props.data.defund12Yaml.logoUrl} />

                    {/* Twitter card protocol */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={this.props.data.defund12Yaml.title} />
                    <meta name="twitter:image" content={this.props.data.defund12Yaml.logoUrl} />
                    <meta name="twitter:description" content={this.props.data.defund12Yaml.meta} />

                    {/* CSS Includes */}
                    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="/css/main.css" />

                    {/* JS Includes */}
                    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossOrigin="anonymous"></script>
                </Helmet>
                <Layout>
                    <EmailList />
                </Layout>
            </>
        );
    }
}

export const data: any = graphql`
    query SiteQuery {
        defund12Yaml {
            title
            meta
            contact_email_footer
            footer_text
            logoUrl
            faviconUrl
        }
    }
`;