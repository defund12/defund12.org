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
        <article className="letterContentSection">
          <div className="container">
            <div className="letterContent">
              <div>
                <h1 className="pagetitle">Letters Sent!</h1>
                <br />
                <p>
                  Thanks, you should get an email in a bit confirming your
                  postcards have been sent
                </p>
                <p className="italic">
                  If you don't in like ... 15 minutes or so, email us at{" "}
                  <a href="mailto:defund12@blackmad.com">
                    defund12@blackmad.com
                  </a>
                </p>
                <br />
                <br />
              </div>
            </div>
          </div>
        </article>
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
