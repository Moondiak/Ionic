import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Ingredient} from '../../../model/ingredient';
import {IngredientService} from '../../../service/ingredient.service';

@Component({
  selector: 'page-ingredient-details',
  templateUrl: './details.html'
})
export class IngredientDetailsPage implements OnInit{
  public ingredient: Ingredient;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ingredientService: IngredientService) {
    this.ingredient = new Ingredient();
  }

  ngOnInit() {
    const id = this.navParams.get('id');
    this.ingredientService.getById(id).subscribe((data) => {
      this.ingredient = data.response;
    });
  }

}
