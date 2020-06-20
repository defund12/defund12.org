/** Returns if the frontend app is in test mode (and therefore should be talking to test stripe checkout flow)
 *
 * @return {boolean} is in test mode
 */
export const isTestMode = (): boolean => {
  return process.env.NODE_ENV === "development";
};
