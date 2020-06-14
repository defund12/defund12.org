/** An option object meant to be used with react-select. */
export interface ReactSelectOption {
  /**
   * The option's human-readable label.
   */
  label: string;
  /**
   * The option's value.
   */
  value?: string | number | Date | Record<string, unknown>;
}
