import * as React from 'react';
import { ChangeEvent } from 'react';

interface EmailListFilterProps {
    itemSource: [number, string][];
    placeholder: string;
    for: string;
    onFilterChange: (newSelection: { [key: string]: number }) => void;
    value?: number | null;
}

export class EmailListFilter extends React.Component<EmailListFilterProps> {
    constructor(props: EmailListFilterProps) {
        super(props);
    }

    renderOptions() {
        return this.props.itemSource.map(item => <option value={item[0]} selected={this.props.value != null && item[0] == this.props.value}>{item[1]}</option>)
    }

    changeFilter(event: ChangeEvent<HTMLSelectElement>) {
        let stateUpdate: any = {};
        stateUpdate[this.props.for] = event.target.value;
        this.props.onFilterChange(stateUpdate);
    }

    render() {
        return (
            <select onChange={this.changeFilter.bind(this)}>
                <option hidden selected={this.props.value == null}>{this.props.placeholder}</option>
                {this.renderOptions()}
            </select>
            );
    }
}