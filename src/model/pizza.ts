import {Ingredient} from './ingredient';
import {User} from './user';

export class Pizza {
  _id: string;
  name: string;
  description: string;
  image: string;
  priceCts: number;
  ingredients: Ingredient[];
  cook: User;

  constructor() {
    this._id = '';
    this.name = '';
    this.description = '';
    this.image = '';
    this.priceCts = 0;
    this.ingredients = [];
    this.cook = null;
  }
}
