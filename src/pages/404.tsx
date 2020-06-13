import React from "react";
import Layout from "../components/common/Layout";
import { graphql } from "gatsby";
import { NotFoundProps } from "../types/PropTypes";

export default class NotFound extends React.Component<NotFoundProps> {
    render() {
        return (
            <Layout {...this.props.data.siteConfig}>
                <main className="content">
                    <div>
                        <h1 className="pagetitle">Page not found</h1>
                        <br />
                        <h3><i>We're sorry, we couldn't find the page you requested</i></h3>
                    </div>
                </main>
            </Layout>
        )
    }
}

export const data = graphql`
    query NotFoundQuery {
        siteConfig {
            title
            meta
            faviconUrl
            logoUrl
        }
    }
`;