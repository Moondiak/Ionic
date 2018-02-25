import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {NavbarService} from '../../../service/navbar.service';
import {IngredientService} from '../../../service/ingredient.service';
import {Ingredient} from '../../../model/ingredient';
import {IngredientEditPage} from '../edit/edit';
import {IngredientDetailsPage} from '../details/details';

@Component({
  selector: 'page-ingredients',
  templateUrl: './list.html'
})
export class IngredientsListPage implements OnInit{

  public ingredients: Ingredient[];
  public sortField: string;
  public sortDirection: boolean;
  public searchString = '';
  private connection;
  public error: boolean;

  constructor(private ingredientService: IngredientService,
              private nav: NavbarService,
              public navCtrl: NavController) {
    this.sortDirection = false;
    this.sortField = 'name';
  }

  ngOnInit() {
    this.nav.show();
    this.nav.refreshStateLogged();
    this.error = false;
    this.ingredientService.get().subscribe((data) => {
      this.ingredients = data.response;
    });
    this.connection = this.ingredientService.listen().subscribe((data) => {
      if (data.type === 'remove') {
        this.ingredients = this.ingredients.filter((ingredient) => {
          return ingredient._id !== data.item;
        });
      } else if (data.type === 'update') {
        this.ingredients.forEach((ingredient, i) => {
          if (data.item._id === ingredient._id) {
            this.ingredients[i] = data.item;
          }
        });
      } else if (data.type === 'add') {
        this.ingredients.push(data.item);
      }
    });
  }

  // remove one ingredient
  remove(id) {
    this.ingredientService.remove(id).subscribe((data) => {},
      (err) => {
        if (!err.response) {
          this.error = true;
        }
      });
  }

  add() {
    this.navCtrl.push(IngredientEditPage);
  }

  edit(id) {
    this.navCtrl.push(IngredientEditPage, {id: id});
  }

  details(id) {
    this.navCtrl.push(IngredientDetailsPage, {id: id});
  }

}
