import * as React from "react";
import { v1 as UUID } from "uuid";
import { StaticQuery, graphql } from "gatsby";
import { EmailListItem } from "./EmailPageLink";
import Select from "react-select";
import { ReactSelectOption } from "../../types/ReactSelectOption";
import { EmailMetadata, RemarkNode, EmailMetadataGroup } from "../../types/EmailData";
import { EmailListProps } from "../../types/PropTypes";

export interface EmailListState {
    /**
     * The currently selected state option.
     */
    selectedState: ReactSelectOption;
}

/**
 * The main container for email links. Overlays on the list layout.
 *
 * _This is meant to be internal to this file and should probably not be exported._
 */
class _EmailList extends React.Component<EmailListProps, EmailListState> {
    stateOptions: Array<ReactSelectOption>;
    constructor(props: any) {
      super(props);
      // generate the state selection options
      this.stateOptions = this.props.stateGroupedEmails.map((stateGroup) => ({ label: stateGroup.name, value: stateGroup.id }));
      // add a default option that will show all email links when selected
      this.stateOptions.unshift({ label: "Choose state", value: 0 });

      this.state = {
        selectedState: this.stateOptions[0],
      };
    }

    /**
     * Renders each email definition it is passed into an email page link.
     * @param data An array of objects containing the email's top-level information.
     */
    renderEmailLinks(data: Array<EmailMetadata>) {
      return data.map((email) => <EmailListItem key={UUID()} {...email} />);
    }

    /**
     * Updates component state with the currently selected geographical state.
     * @param selectedState The option object of the selected state.
     */
    onStateSelectionChanged(selectedState: ReactSelectOption) {
      this.setState({ selectedState });
    }

    render() {
      return (
        <main className="content">
          <div id="filters">
            <Select
              aria-label="Select State"
              className="reactSelect"
              value={this.state.selectedState}
              onChange={this.onStateSelectionChanged.bind(this)}
              options={this.stateOptions}>
            </Select>
          </div>
          <section className="cityList" id="emailLinks">
            <article>
              {this.props
                  .stateGroupedEmails
                  .filter((stateGroup) =>
                    this.state.selectedState.value === 0 /* 'Choose state' */ ||
                            stateGroup.id === this.state.selectedState.value)
                  .map((stateGroup) => {
                    return (
                      <ul key={UUID()} className="state">
                        <h2>{stateGroup.name}</h2>
                        {this.renderEmailLinks(stateGroup.emails)}
                      </ul>
                    );
                  })}
            </article>
          </section>
          <p className="divider footer"></p>
        </main>
      );
    }
}

/**
 * Groups the array of email metadata passed to it by state and assigns each state an ID number.
 * @param metadata Email metadata collected from markdown.
 */
function groupEmailMetadataByState(metadata: Array<EmailMetadata>): Array<EmailMetadataGroup> {
  // map group the emails with all others in the same state
  const emailGroups = Object.values(metadata.reduce((prev: {[key: string]: EmailMetadataGroup}, current: EmailMetadata) => {
    const stateName = current.state;

    // if the state has not been added yet, add a new email group for it
    if (!prev[stateName]) {
      prev[stateName] = new EmailMetadataGroup(stateName);
    }

    // add the current email metadata to the group for its state
    prev[stateName].emails.push(current);

    return prev;
  }, {}))
      .sort((first, second) => first.name > second.name ? 1 : -1); // and sort the groups alphabetically by state

  // assign each state an ID based on its index
  emailGroups.forEach((stateGroup, index) => stateGroup.id = index + 1);

  return emailGroups;
}

/**
 * The main container for email links, including filtering.
 */
export default function EmailList() {
  return (
    <StaticQuery
      query={
        graphql`
                query EmailListQuery {
                    allMarkdownRemark(filter: {frontmatter: {permalink: {ne: null}, name: {ne: null}}}) {
                        nodes {
                            frontmatter {
                                permalink
                                name
                                city
                                state
                            }
                        }
                    }
                }
            `
      }
      render={
        (data: { allMarkdownRemark: { nodes: Array<RemarkNode> } }) => {
          // extract the email metadata from the nodes collected from markdown
          const allEmailMetadata = data.allMarkdownRemark.nodes.map((node: RemarkNode) => node.frontmatter);

          const stateGroupedEmails = groupEmailMetadataByState(allEmailMetadata);

          return <_EmailList stateGroupedEmails={stateGroupedEmails}></_EmailList>;
        }
      } />
  );
}