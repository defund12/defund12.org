import { Address, OfficialRestrict } from "../../services/OfficialTypes";

export const POSTCARD_COST = 0.7;
export const LETTER_COST = 1.0;

export interface Template {
  template: string;
  addresses?: Address[];
  name?: string;
  id?: string;
  notes?: string;
  officialRestricts?: OfficialRestrict[];
  cityCouncilOnly?: boolean;
}
