import React from 'react';
import Layout from '../components/common/Layout';
import {graphql, PageProps} from 'gatsby';
import {SiteProps} from '../types/PropTypes';

/**
 * The site's 404 page.
 */
export default class NotFound extends React.Component<PageProps<SiteProps>> {
  /**
    * React render method.
    * @return {React.ReactNode} the rendered component
    */
  render(): React.ReactNode {
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
    );
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
