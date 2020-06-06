import * as React from 'react';

export class Defund12App extends React.Component<{ title: string }> {
    title: string;
    constructor(props: { title: string }) {
        super(props);
        this.title = props.title
    }

    render() {
        return <h1>{this.title}</h1>;
    }
}
