import { CovidDistrict } from "./disctrict.model";

export class CovidDistricts {
  [districtCode: string]: CovidDistrict;

  constructor(data: { [districtCode: string]: CovidDistrict }) {
    Object.assign(this, data);
  }
}
