import { CovidDistricts } from "./covid-districts.model";
import { Delta } from "./delta.model";
import { MetaMetric } from "./meta.model";

export class CovidState {
    constructor(
        public delta?: Delta,
        public delta7?: Delta,
        public delta21_14?: Delta,
        public districts?: CovidDistricts,
        public meta?: MetaMetric,
        public total?: Delta
    ) {}
}