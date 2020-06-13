import React from 'react'
import { graphql } from 'gatsby';
import Layout from '../components/common/Layout';
import EmailList from '../components/email-list/EmailList';

import '../../css/main.scss';
import { SiteConfig } from '../types/SiteConfig';

interface SiteProps {
    data: {
        siteConfig: SiteConfig
    }
}

export default class Index extends React.Component<SiteProps> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <Layout siteConfig={this.props.data.siteConfig}>
                    <EmailList />
                </Layout>
            </>
        );
    }
}

export const data: any = graphql`
    query SiteQuery {
        siteConfig {
            title
            meta
            contact_email_footer
            footer_text
            logoUrl
            faviconUrl
        }
    }
`;