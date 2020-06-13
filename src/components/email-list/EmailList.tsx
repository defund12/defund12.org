import * as React from 'react';
import { v1 as UUID } from 'uuid';
import { StaticQuery, graphql } from 'gatsby';
import { EmailListItem } from './EmailListItem';
import Select from 'react-select';

interface ReactSelectOption {
    label: string;
    value: any;
}

export interface EmailListState {
    selectedState: ReactSelectOption;
}

interface EmailMetadata {
    permalink: string;
    name: string;
    city: string;
    state: string;
}

interface EmailListProps {
    emailsStateGrouped: Array<[string, number, Array<EmailMetadata>]>;
}

/**
 * The main container for email links. Overlays on the list layout.
 */
class _EmailList extends React.Component<EmailListProps, EmailListState> {
    stateOptions: Array<ReactSelectOption>;
    constructor(props: any) {
        super(props);
        this.stateOptions = this.props.emailsStateGrouped.map(([state, id]) => ({ label: state, value: id }));
        this.stateOptions.unshift({ label: 'Choose state', value: 0 });
        this.state = {
            selectedState: this.stateOptions[0]
        };
    }

    renderEmailLinks(data: Array<EmailMetadata>) {
        return data.map(email => <EmailListItem key={UUID()} emailInfo={email} />)
    }

    onStateSelectionChanged(selectedState: ReactSelectOption) {
        this.setState({selectedState});
    }

    render() {
        return (<>
            <div id="filters">
                <Select aria-label="Select State" id="selected_state" value={this.state.selectedState} onChange={this.onStateSelectionChanged.bind(this)} options={this.stateOptions}>
                </Select>
            </div>
            {this.props
            .emailsStateGrouped
            .filter(([_, id]) => this.state.selectedState.value === 0 || id === this.state.selectedState.value)
            .map(([state, _, data]) => {
                return (
                    <div key={UUID()} className="state">
                        <h2>{state}</h2>
                        {this.renderEmailLinks(data)}
                    </div>
                );
            })}
            </>);
    }
}

interface EmailNode {
    frontmatter: EmailMetadata
}

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
            (data: any) => {
                let id = 0;
                const emailsStateGrouped = Object.entries(data.allMarkdownRemark.nodes.reduce((prev: {[key: string]: Array<EmailMetadata>}, current: EmailNode) => {
                    if (!prev[current.frontmatter.state]) {
                        prev[current.frontmatter.state] = [];
                    }
                    prev[current.frontmatter.state].push(current.frontmatter);
                    return prev;
                }, {})).sort().map(set => [set[0], ++id, set[1]] as [string, number, Array<EmailMetadata>]);
                return <_EmailList emailsStateGrouped={emailsStateGrouped}></_EmailList>
            }
        } />
    );
}