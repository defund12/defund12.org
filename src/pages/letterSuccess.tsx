import React from "react";
import Layout from "../components/common/Layout";
import { graphql, PageProps } from "gatsby";
import { SiteProps } from "../types/PropTypes";

/** The page for when a letter is successfully sent */
export default class LetterSuccess extends React.Component<
  PageProps<SiteProps>
> {
  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <Layout {...this.props.data.siteConfig}>
        <main className="content">
          <h1 className="pagetitle">Letters Sent!</h1>
          <br />
          <h2>
            Thanks, you should get an email in a bit confirming your postcards
            have been sent
          </h2>
          <i>
            <h2>
              If you don't in like ... 15 minutes? email me at{" "}
              <a href="mailto:mail-your-rep@blackmad.com">
                mail-your-rep@blackmad.com
              </a>
            </h2>
          </i>
          <br />
          <br />
        </main>
      </Layout>
    );
  }
}

export const data = graphql`
  query LetterSuccessQuery {
    siteConfig {
      siteTitle
      meta
      faviconUrl
      logoUrl
    }
  }
`;
