import * as React from 'react';
import { v1 as UUIDv1 } from 'uuid';
import { ChangeEvent } from 'react';

interface EmailListFilterProps {
    /** The items to generate options from. */
    itemSource: [number, string][];
    /** Placeholder text shown when the value is null. */
    placeholder: string;
    /** A string key for the state property to change. */
    for: string;
    /** A callback used when a new value is selected, sends an object with one property using {@link for} as its key and {@link value} as its value. */
    onFilterChange: (newSelection: { [key: string]: number }) => void;
    /** The current value of the filter. */
    value?: number | null;
}

/**
 * A filter select that writes state back using {@link: EmailListFilterProps.onFilterChange}.
 */
export class EmailListFilter extends React.Component<EmailListFilterProps> {
    constructor(props: EmailListFilterProps) {
        super(props);
    }

    renderOptions() {
        return this.props.itemSource.map(item => <option key={UUIDv1()} value={item[0]}>{item[1]}</option>)
    }

    changeFilter(event: ChangeEvent<HTMLSelectElement>) {
        let stateUpdate: any = {};
        stateUpdate[this.props.for] = event.target.value;
        this.props.onFilterChange(stateUpdate);
    }

    render() {
        return (
            <select defaultValue={this.props.value?.toString()} onChange={this.changeFilter.bind(this)}>
                <option hidden key={UUIDv1()} value="null">{this.props.placeholder}</option>
                {this.renderOptions()}
            </select>
            );
    }
}