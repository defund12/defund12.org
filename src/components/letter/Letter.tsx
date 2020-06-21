import { graphql, PageProps } from "gatsby";
import React from "react";
import { LetterData } from "../../types/TemplateData";
import { LetterProps, LetterConfig } from "../../types/PropTypes";
import Layout from "../common/Layout";
import LetterList from "../template-list/LetterList";
import LetterForm from "./LetterForm";
import { OfficialRestrict } from "../../services/OfficialTypes";

/**
 * A rendered email, containing links to send or copy.
 */
export default class Letter extends React.Component<PageProps<LetterProps>> {
  letterData: LetterData;
  title: string;
  meta: string;
  siteConfig: LetterConfig;

  /**
   * Initialize the component and its state.
   * @param {PageProps<EmailProps>} props
   */
  constructor(props: PageProps<LetterProps>) {
    super(props);
    this.siteConfig = this.props.data.siteConfig;
    this.letterData = this.props.data.markdownRemark.frontmatter;
    this.title = `Defund 12 in ${this.letterData.city}, ${this.letterData.state}`;
    this.meta = `Send a pre-written letter directly to ${this.letterData.city}, ${this.letterData.state} officials`;
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
      <Layout pageTitle={this.title} meta={this.meta}>
        <section className="emailPageHeader">
          <h2>{this.letterData.name}</h2>
          <b>
            {this.letterData.city}, {this.letterData.state}
          </b>
          <p>{this.siteConfig.letterMessage}</p>
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
      letterMessage
      googleApiKey
    }
  }
`;
