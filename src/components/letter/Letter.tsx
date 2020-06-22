import { graphql, PageProps } from "gatsby";
import React from "react";
import { LetterData } from "../../types/TemplateData";
import {
  LetterConfig,
  LetterProps,
  OptionalLayoutProps,
} from "../../types/PropTypes";
import Layout from "../common/Layout";
import LetterList from "../template-list/LetterList";
import LetterForm from "./LetterForm";
import { OfficialRestrict } from "../../services/OfficialTypes";
import { DefundUtils } from "../../DefundUtils";
import * as queryString from "query-string";

/**
 * A rendered email, containing links to send or copy.
 */
export default class Letter extends React.Component<PageProps<LetterProps>> {
  letterData: LetterData;
  siteConfig: LetterConfig;
  layoutProps: OptionalLayoutProps;

  /**
   * Initialize the component and its state.
   * @param {PageProps<EmailProps>} props
   */
  constructor(props: PageProps<LetterProps>) {
    super(props);
    console.log(this.props);
    this.siteConfig = this.props.data.siteConfig;
    this.letterData = this.props.data.markdownRemark.frontmatter;
    this.layoutProps = {
      pageTitle: `Defund12.org in ${this.letterData.city}, ${this.letterData.state}`,
      meta: `Send a pre-written letter directly to ${this.letterData.city}, ${this.letterData.state} officials.`,
      metaQueryString: queryString.stringify({
        subheader: `in ${this.letterData.city}, ${this.letterData.state}`,
        subtitle1: `Order physical letters to be printed and mailed to ${this.letterData.city} government officials.`,
      }),
      layout: "letter",
    };
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    // parse the offical restricts from the template markdown that look like
    // locality:legislatorUpperBody into structured restricts for our APIs
    const officialRestricts = this.letterData.officials?.map(
      (officialString) => {
        const parts = officialString.split(":");
        return {
          level: parts[0],
          role: parts[1],
        } as OfficialRestrict;
      }
    );

    const template = {
      template: this.letterData.body,
      officialRestricts,
    };

    return (
      <Layout {...this.layoutProps}>
        <section className="emailPageHeader">
          <h2>{this.letterData.name}</h2>
          <b>
            {this.letterData.city}, {this.letterData.state}
          </b>
          <div className="buttons">
            <a
              onClick={() =>
                DefundUtils.copyToClipboard(this.letterData.permalink, true)
              }
            >
              Copy link
            </a>
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: DefundUtils.markdownToHTML(
                this.siteConfig.letterPageHeader
              ),
            }}
          ></p>
        </section>

        <article className="letterContentSection">
          <div className="container">
            <div className="letterContent">
              <LetterForm
                template={template}
                googleApiKey={this.siteConfig.googleApiKey}
              ></LetterForm>
            </div>
          </div>
        </article>
        <LetterList />
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query($permalink: String!) {
    markdownRemark(
      frontmatter: { permalink: { eq: $permalink }, layout: { eq: "letter" } }
    ) {
      frontmatter {
        body
        cc
        city
        country
        date
        name
        state
        permalink
        officials
      }
    }
    siteConfig {
      letterPageHeader
      googleApiKey
    }
  }
`;
