import { Delta } from "./delta.model";
import { MetaMetric } from "./meta.model";

export class CovidDistrict {
    constructor(
        public delta?: Delta,
        public delta7?: Delta,
        public delta21_14?: Delta,
        public meta?: MetaMetric,
        public total?: Delta
    ) {}
}