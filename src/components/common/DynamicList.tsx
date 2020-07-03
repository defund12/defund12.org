import React from "react";
import { DynamicListProps } from "./PropTypes";
import { v1 as uuid } from "uuid";
import { isFunction } from "lodash";

interface DynamicListState<TModel> {
  listItems: Array<TModel>;
  keys: Array<string>;
}

/**
 * A component that can generate an arbitrary number
 * of instances of a component provided by the caller.
 */
export default class DynamicList<TModel> extends React.Component<
  DynamicListProps<TModel>,
  DynamicListState<TModel>
> {
  /**
   * Initialize component and its state.
   * @param {DynamicListProps<TModel>} props
   */
  constructor(props: DynamicListProps<TModel>) {
    super(props);
    this.state = {
      listItems: [],
      keys: [],
    };
  }

  /**
   * Removes the child component instance at the provided index.
   * @param {number} index
   */
  deleteItem(index: number): void {
    const updatedListItems = [...this.state.listItems];
    updatedListItems.splice(index, 1);

    const updatedKeys = [...this.state.keys];
    updatedKeys.splice(index, 1);

    this.setState({ listItems: updatedListItems, keys: updatedKeys });
    this.props.updateModel(this.state.listItems);
  }

  /**
   * Creates a new child component instance.
   */
  addItem(): void {
    const updatedListItems = [
      ...this.state.listItems,
      this.props.modelFactory(),
    ];
    const updatedKeys = [...this.state.keys, uuid()];

    this.setState({ listItems: updatedListItems, keys: updatedKeys });
    this.props.updateModel(this.state.listItems);
  }

  /**
   * Replaces the child component state at the provided
   * index with the provided value.
   * @param {number} index the index of the child instance to update
   * @param {TModel} value the new state value
   */
  updateItem(index: number, value: TModel): void {
    const updatedModel = [...this.state.listItems];
    updatedModel[index] = value;
    this.setState({ listItems: updatedModel });
    this.props.updateModel(this.state.listItems);
  }

  /**
   * Renders each child instance using the component provided in the caller.
   * @return {React.ReactNode} the rendered child components
   */
  renderChildren(): React.ReactNode {
    return this.state.listItems.map((entry: TModel, index: number) => {
      return (
        <div key={this.state.keys[index]}>
          <button onClick={() => this.deleteItem(index)}>Delete</button>
          {this.props.eachRender((value: TModel) =>
            this.updateItem(index, value)
          )}
        </div>
      );
    });
  }

  /**
   * React render method.
   * @return {React.ReactNode} the rendered component
   */
  render(): React.ReactNode {
    return (
      <>
        {this.renderChildren()}
        <button onClick={() => this.addItem()}>
          {isFunction(this.props.addText)
            ? this.props.addText(this.state.listItems)
            : this.props.addText}
        </button>
      </>
    );
  }
}
