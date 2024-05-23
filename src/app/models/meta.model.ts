export class MetaMetric {
  constructor(
    public date?: string,
    public last_updated?: string,
    public population?: string,
    public tested?: Tested,
    public vaccinated?: Vaccinated
  ) {}
}

class Vaccinated {
  constructor(public date?: string) {}
}

class Tested {
  constructor(public date?: string, public source?: string) {}
}
