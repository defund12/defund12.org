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
import styled from "@emotion/styled";

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
      pageTitle: `Defund12 in ${this.letterData.city}, ${this.letterData.state}`,
      meta: `Send a pre-written letter directly to ${this.letterData.city}, ${this.letterData.state} officials`,
      metaQueryString: queryString.stringify({
        state: this.letterData.state,
        city: this.letterData.city,
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
        <StyledSection>
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
        </StyledSection>

        <StyledArticle>
          <div className="container">
            <div className="letterContent">
              <LetterForm
                template={template}
                googleApiKey={this.siteConfig.googleApiKey}
              ></LetterForm>
            </div>
          </div>
        </StyledArticle>
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

const StyledSection = styled.section`
  width: calc(100vw - var(--x8));
  max-width: var(--m);
  padding-bottom: var(--x4);

  b {
    display: block;
    margin-bottom: var(--x2);
  }

  .buttons {
    margin: var(--x3) 0;

    a {
      display: inline-block;
      color: var(--link);
      cursor: pointer;

      &:not(:last-child) {
        margin-right: var(--x2);
      }
    }
  }
`;

const StyledArticle = styled.article`
  padding: var(--x4) 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg_);

  .container {
    width: calc(100vw - var(--x8));
    max-width: var(--m);

      .alert {
      padding: 20px;
      background-color: #f44336; /* Red */
      color: white;
      margin-bottom: 15px;
    }

  textarea {
    width: 100%;
    height: 100%;
    resize: none;
  }

  input[type=checkbox] {
    margin: var(--x1);
  }

  div.pure-control-group {
    margin-top: unset;
  }

  button {
    border-color: hsl(0,0%,80%);
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: var(--x1) var(--x2);
    margin-top: var(--x2);
  }

  .right-pad-input {
    input {
      width: 100%;
      @media screen and (min-width: var(--s)) {
        width: calc(100% - 5px);
      }
    }
  }

  .full-width {
    width: 100%;
  }

  .pure-form fieldset {
    padding: .25em 0 .25em;
  }

  .text-center {
    display: flex;
    justify-content: center;
  }

  label.official-checkbox {
    display: flex;
    margin: var(--x2) 0;
  }
}

.letter-success {
  padding: var(--x4) 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg_);

  .italic {
    font-style: italic;
  }
}

.letterContentSection {
  padding: var(--x4) 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg_);
  padding: ar(--x4) 0;
}


  }
`;

// .letter-form {
//   * {
//     font-family: inherit !important;
//   }
