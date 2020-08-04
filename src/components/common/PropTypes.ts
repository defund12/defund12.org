export interface DynamicListProps<TModel> {
  addText: string | ((listItems: Array<TModel>) => string);
  modelFactory: () => TModel;
  onListItemsUpdated: (value: Array<TModel>) => void;
  renderListItem: (onListItemUpdated: (value: TModel) => void) => JSX.Element;
}
