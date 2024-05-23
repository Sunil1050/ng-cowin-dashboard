import { CovidState } from "./state.model";

export class Covid19StateWiseData {
  [stateCode: string]: CovidState;

  constructor(data: { [stateCode: string]: CovidState }) {
    Object.assign(this, data);
  }
}
Covid19StateWiseData