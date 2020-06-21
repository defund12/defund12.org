/* eslint-disable camelcase */
import {
  OfficialRestrict,
  OfficialAddress,
} from "../../services/OfficialTypes";

export const POSTCARD_COST = 0.7;
export const LETTER_COST = 1.0;

export interface LobAddress {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  email?: string;
}

export interface Template {
  template: string;
  addresses?: OfficialAddress[];
  name?: string;
  id?: string;
  notes?: string;
  officialRestricts?: OfficialRestrict[];
  cityCouncilOnly?: boolean;
}
