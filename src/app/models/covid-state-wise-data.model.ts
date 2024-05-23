import { CovidState } from "./state.model";

export class CovidData {
  [stateCode: string]: CovidState;

  constructor(data: { [stateCode: string]: CovidState }) {
    Object.assign(this, data);
  }
}
