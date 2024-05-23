export class CovidTabStat {
    constructor(
        public imageUrl: string,
        public status: CovidStatus,
        public cases: number,
        public color: string,
        public bgColor: string,
    ) {}
}

export type CovidStatus = 'Confirmed' | 'Deceased' | 'Recovered' | 'Active';
