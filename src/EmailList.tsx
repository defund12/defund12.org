import * as React from 'react';

export class EmailList extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}