import * as React from 'react';

export class PageTitle extends React.Component<{ title: string }> {
    title: string;
    constructor(props: any) {
        super(props);
        this.title = this.props.title
    }

    render() {
        return <h1>{this.title}</h1>;
    }
}
