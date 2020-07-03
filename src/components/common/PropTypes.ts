export interface DynamicListProps<TModel> {
  addText: string | ((listItems: Array<TModel>) => string);
  modelFactory: () => TModel;
  updateModel: (value: Array<TModel>) => void;
  eachRender: (updateModel: (value: TModel) => void) => JSX.Element;
}
