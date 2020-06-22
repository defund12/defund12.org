import React from "react";
import { PageProps, StaticQuery, graphql } from "gatsby";
import Layout from "../components/common/Layout";
import TemplateList from "../components/template-list/TemplateList";
import { SiteProps, LettersPageConfig } from "../types/PropTypes";
import { DefundUtils } from "../DefundUtils";
import * as queryString from "query-string";

/**
 * Contains a list just like the homepage, but with letters.
 */
export default class Letters extends React.Component<PageProps<SiteProps>> {
  /**
   * Initialize the component.
   * @param {PageProps<SiteProps>} props
   */
  constructor(props: PageProps<SiteProps>) {
    super(props);
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <StaticQuery
        query={graphql`
          query LetterPageQuery {
            siteConfig {
              letterPageHeader
              letterMetaPreviewSubtitle
              letterMeta
            }
          }
        `}
        render={(data: { siteConfig: LettersPageConfig }) => {
          const header = (
            <span
              dangerouslySetInnerHTML={{
                __html: DefundUtils.markdownToHTML(
                  data.siteConfig.letterPageHeader
                ),
              }}
            ></span>
          );

          const layoutProps = {
            pageTitle: "Letters by Defund12.org",
            meta: data.siteConfig.letterMeta,
            metaQueryString: queryString.stringify({
              subtitle1: data.siteConfig.letterMetaPreviewSubtitle,
            }),
          };

          return (
            <Layout {...layoutProps}>
              <TemplateList layout="letter" header={header} />
            </Layout>
          );
        }}
      />
    );
  }
}
