import * as _ from "lodash";

import {
  OfficialAddress,
  OfficialRestrict,
  LevelsAndRoles,
} from "./OfficialTypes";

export type FetchOfficialsParams = {
  /** address to look up officials for */
  address: string;
  /** restricts on what levels/roles of officials to return */
  restricts?: OfficialRestrict[];
};

type ShouldUseOfficialParams = {
  /** restricts restricts to obey */
  restricts?: OfficialRestrict[];
} & LevelsAndRoles;

/** Whether or not an official should be included based on resticts
 *
 * @param {ShouldUseOfficialParams} restricts, roles and levels
 * @return {boolean} should use
 */
export function shouldUseOfficial({
  restricts,
  levels,
  roles,
}: ShouldUseOfficialParams): boolean {
  // if restricts is empty let everything through
  if (!restricts) {
    return true;
  }

  return _.some(
    restricts || [],
    (restrict) =>
      (levels || []).includes(restrict.level) &&
      ((restrict.role as string) === "*" ||
        (roles || []).includes(restrict.role))
  );
}

export interface AbstractRepresentativeFetchingService {
  fetch(params: FetchOfficialsParams): Promise<OfficialAddress[]>;
}
