import { graphql, PageProps } from "gatsby";
import React from "react";
import {
  PhoneScriptProps,
  PhoneScriptConfig,
  OptionalLayoutProps,
} from "../../types/PropTypes";
import { PhoneScriptData, PhoneScriptContact } from "../../types/TemplateData";
import * as queryString from "query-string";
import Layout from "../common/Layout";
import { DefundUtils } from "../../DefundUtils";
import PhoneList from "../template-list/PhoneList";

/**
 * The @link {PhoneScript} component state.
 */
class PhoneScriptState {
  bodyCopied = false;
}

/**
 * A rendered phone script, containing links to copy the script text or link.
 */
export default class PhoneScript extends React.Component<
  PageProps<PhoneScriptProps>,
  PhoneScriptState
> {
  siteConfig: PhoneScriptConfig;
  phoneScriptData: PhoneScriptData;
  layoutProps: OptionalLayoutProps;
  /**
   * Initialize the component and its state
   * @param {PageProps<PhoneScriptConfig>} props
   */
  constructor(props: PageProps<PhoneScriptProps>) {
    super(props);
    this.siteConfig = this.props.data.siteConfig;
    this.phoneScriptData = this.props.data.markdownRemark.frontmatter;
    this.layoutProps = {
      pageTitle: `Defund12 in ${this.phoneScriptData.city}, ${this.phoneScriptData.state}`,
      meta: `View a phone script to call ${this.phoneScriptData.city}, ${this.phoneScriptData.state} officials`,
      metaQueryString: queryString.stringify({
        state: this.phoneScriptData.state,
        city: this.phoneScriptData.city,
      }),
      layout: "phone",
    };
    this.state = new PhoneScriptState();
  }

  /**
   * Updates the component state to reflect which element was clicked and
   * copies the selected element to the user's clipboard.
   * @param {Pick<EmailState, K>} statePatch an object containing
   *   the state update to apply
   * @param {string} copy the text to copy to the user's clipboard.
   */
  handleClipboardCopy<K extends keyof PhoneScriptState>(
    statePatch: Pick<PhoneScriptState, K>,
    copy: string
  ): void {
    this.setState(statePatch);
    DefundUtils.copyToClipboard(copy);
  }

  /**
   * Renders the phone script's contact list as list items.
   * @return {React.ReactNode}
   */
  renderContacts(): React.ReactNode {
    return this.phoneScriptData.contacts.map((contact: PhoneScriptContact) => (
      <li>
        {contact.name}, {contact.number}
      </li>
    ));
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <Layout {...this.layoutProps}>
        <section className="emailPageHeader">
          <h2>{this.phoneScriptData.name}</h2>
          <b>
            {this.phoneScriptData.city}, {this.phoneScriptData.state}
          </b>
          <div className="buttons">
            <a
              onClick={() =>
                DefundUtils.copyToClipboard(
                  this.phoneScriptData.permalink,
                  true
                )
              }
            >
              Copy link
            </a>
          </div>
          <ul>{this.renderContacts()}</ul>
        </section>

        <article className="phoneScriptContentSection">
          <div className="container">
            <div className="phoneScriptContent">
              <div>
                <span>Message:</span>
                <span
                  className="copyToClipboard"
                  onClick={() =>
                    this.handleClipboardCopy(
                      { bodyCopied: true },
                      this.phoneScriptData.body
                    )
                  }
                >
                  {this.state.bodyCopied ? "✅(copied)" : "🔗"}
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: DefundUtils.markdownToHTML(
                      this.phoneScriptData.body
                    ),
                  }}
                ></span>
              </div>
            </div>
          </div>
        </article>

        <PhoneList />
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query($permalink: String!) {
    markdownRemark(
      frontmatter: { permalink: { eq: $permalink }, layout: { eq: "phone" } }
    ) {
      frontmatter {
        body
        city
        country
        date
        name
        state
        permalink
        contacts {
          name
          number
        }
      }
    }
  }
`;
