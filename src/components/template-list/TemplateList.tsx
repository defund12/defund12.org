import * as React from "react";
import { v1 as uuid } from "uuid";
import { StaticQuery, graphql } from "gatsby";
import { TemplateListItem } from "./TemplateListItem";

import Select from "react-select";
import { ReactSelectOption } from "../../types/ReactSelectOption";
import {
  SharedTemplateMetadata,
  RemarkNode,
  TemplateMetadataGroup,
  LayoutType,
} from "../../types/TemplateData";
import { TemplateListProps } from "../../types/PropTypes";
import styled from "@emotion/styled";

export interface TemplateListState {
  /**
   * The currently selected state option.
   */
  selectedState: ReactSelectOption;
}

/**
 * The main container for email links. Overlays on the list layout.
 *
 * _This is meant to be internal to this file and should probably not be
 * exported._
 */
class _TemplateList extends React.Component<
  TemplateListProps,
  TemplateListState
> {
  stateOptions: Array<ReactSelectOption>;
  selectStyles = {
    option: (provided: React.CSSProperties) => ({
      ...provided,
      color: "black",
    }),
  };
  /**
   * Initialize the list component along with its filter options.
   * @param {TemplateListProps} props
   */
  constructor(props: TemplateListProps) {
    super(props);
    const templates = this.props.stateGroupedTemplates;

    // generate the state selection options
    this.stateOptions = templates.map((stateGroup) => ({
      label: stateGroup.name,
      value: stateGroup.id,
    }));

    // add a default option that will show all email links when selected
    this.stateOptions.unshift({ label: "Choose state", value: 0 });

    this.state = {
      selectedState: this.stateOptions[0],
    };
  }

  /**
   * Renders each email definition it is passed into an email page link.
   * @param {Array<SharedTemplateMetadata>} data
   *   An array of objects containing the email's top-level information.
   * @return {Array<React.ReactNode>}
   */
  renderEmailLinks(
    data: Array<SharedTemplateMetadata>
  ): Array<React.ReactNode> {
    return data.map((email) => {
      return <TemplateListItem key={uuid()} {...email} />;
    });
  }

  /**
   * Updates component state with the currently selected geographical state.
   * @param {ReactSelectOption} selectedState
   *   The option object of the selected state.
   */
  onStateSelectionChanged(selectedState: ReactSelectOption) {
    this.setState({ selectedState });
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <StyledMain>
        <div id="filters">
          <Select
            aria-label="Select State"
            className="reactSelect"
            value={this.state.selectedState}
            onChange={this.onStateSelectionChanged.bind(this)}
            options={this.stateOptions}
            styles={this.selectStyles}
          ></Select>
        </div>
        <section className="cityList" id="emailLinks">
          <article>
            {this.props.stateGroupedTemplates
              .filter(
                (stateGroup) =>
                  this.state.selectedState.value === 0 /* 'Choose state' */ ||
                  stateGroup.id === this.state.selectedState.value
              )
              .map((stateGroup) => {
                return (
                  <>
                    <h2>{stateGroup.name}</h2>
                    <ul key={uuid()} className="state">
                      {this.renderEmailLinks(stateGroup.templates)}
                    </ul>
                  </>
                );
              })}
          </article>
        </section>
        <p className="divider footer"></p>
      </StyledMain>
    );
  }
}

/**
 * Groups the array of email metadata passed to it by state
 * and assigns each state an ID number.
 * @param {Array<SharedTemplateMetadata>} metadata
 *   Email metadata collected from markdown.
 * @return {Array<TemplateMetadataGroup>}
 */
function groupTemplateMetadataByState(
  metadata: Array<SharedTemplateMetadata>
): Array<TemplateMetadataGroup> {
  // map group the emails with all others in the same state
  const emailGroups = Object.values(
    metadata
      // sort cities alphabetically before grouping into states
      .sort((first, second) => (first.city > second.city ? 1 : -1))
      .reduce(
        (
          prev: { [key: string]: TemplateMetadataGroup },
          current: SharedTemplateMetadata
        ) => {
          const stateName = current.state;

          // if the state has not been added yet,
          // add a new email group for it
          if (!prev[stateName]) {
            prev[stateName] = new TemplateMetadataGroup(stateName);
          }

          // add the current email metadata to the group for its state
          prev[stateName].templates.push(current);

          return prev;
        },
        {}
      )
  )
    // and sort the groups alphabetically by state
    .sort((first, second) => (first.name > second.name ? 1 : -1));

  // assign each state an ID based on its index
  emailGroups.forEach((stateGroup, index) => (stateGroup.id = index + 1));

  return emailGroups;
}

type TemplateListParams = {
  /** filters the rendered entries to "email" or "letter" */
  layout: LayoutType;
  /** extra info displayed above the list */
  header?: React.ReactElement;
};

/**
 * The main container for email links, including filtering.
 * @param {string} layout the kinds of templates to show - email or letter
 * @return {React.ReactNode} The rendered email component,
 * with data from GraphQL.
 */
export default function TemplateList({
  layout,
  header,
}: TemplateListParams): JSX.Element {
  return (
    <StaticQuery
      query={graphql`
        query TemplateListQuery {
          allMarkdownRemark(
            filter: {
              frontmatter: { permalink: { ne: null }, name: { ne: null } }
            }
          ) {
            nodes {
              frontmatter {
                permalink
                name
                city
                state
                layout
              }
            }
          }
        }
      `}
      render={(data: { allMarkdownRemark: { nodes: Array<RemarkNode> } }) => {
        // extract the email metadata from the nodes collected from markdown
        const allNodes = data.allMarkdownRemark.nodes;
        const allTemplateMetadata = allNodes
          .map((node: RemarkNode) => node.frontmatter)
          .filter((v) => v.layout === layout);

        const stateGroupedTemplates = groupTemplateMetadataByState(
          allTemplateMetadata
        );

        return (
          <>
            {header && <header>{header}</header>}
            <_TemplateList stateGroupedTemplates={stateGroupedTemplates} />
          </>
        );
      }}
    />
  );
}

const StyledMain = styled.main`
  margin-top: var(--x6);
  min-height: 25vh;
  #filters {
    width: 200px;
    margin-bottom: 40px;
  }
  .cityList {
    width: calc(100vw - var(--x8));
    max-width: var(--m);
    .state {
      margin-top: var(--x1);
    }
    h2 {
      margin-bottom: var(--x1);
    }
    a {
      color: var(--link);
    }
    a:visited {
      color: var(--text);
    }
    ul {
      margin-left: var(--x1);
      li {
        text-indent: 0.65em;
        margin-top: var(--x2);
        margin-bottom: var(--x2);
        @media screen and (min-width: 48rem) {
          margin-top: var(--x1);
          margin-bottom: var(--x1);
        }
      }
    }
    & + .divider {
      margin-top: var(--x5);
    }
  }
`;
