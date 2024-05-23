export class Delta {
  constructor(
    public confirmed?: number,
    public deceased?: number,
    public recovered?: number,
    public tested?: number,
    public vaccinated1?: number,
    public vaccinated2?: number
  ) {}
}
