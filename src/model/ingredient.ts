export class Ingredient {
  _id: string;
  name: string;
  weight: number;
  priceCts: number;

  constructor() {
    this._id = '';
    this.name = '';
    this.weight = 0;
    this.priceCts = 0;
  }
}
