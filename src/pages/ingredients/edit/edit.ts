import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../../../model/ingredient';
import {IngredientService} from '../../../service/ingredient.service';
import {IngredientsListPage} from '../list/list';

@Component({
  selector: 'page-ingredient-edit',
  templateUrl: './edit.html'
})
export class IngredientEditPage implements OnInit{

  public form: FormGroup;
  public currentIngredient: any;
  public id: string;

  constructor(private ingredientService: IngredientService,
              public authService: AuthService,
              public navCtrl: NavController,
              public navParams: NavParams) {
    this.id = this.navParams.get('id');
  }

  ngOnInit() {
    this.currentIngredient = new Ingredient();
    this.form = new FormGroup({
      name: new FormControl(this.currentIngredient.name, Validators.compose([
        Validators.minLength(0),
        Validators.required
      ])),
      priceCts: new FormControl(this.currentIngredient.priceCts, Validators.compose([
        Validators.minLength(0),
        Validators.required
      ])),
      weight: new FormControl(this.currentIngredient.weight, Validators.compose([
        Validators.minLength(0),
        Validators.required
      ]))
    });

    if (this.id) {
      this.ingredientService.getById(this.id).subscribe((data) => {
        this.currentIngredient = data.response;

        this.currentIngredient.priceCts = this.currentIngredient.priceCts / 100;

        this.form = new FormGroup({
          name: new FormControl(this.currentIngredient.name, Validators.compose([
            Validators.minLength(0),
            Validators.required
          ])),
          priceCts: new FormControl(this.currentIngredient.priceCts, Validators.compose([
            Validators.minLength(0),
            Validators.required
          ])),
          weight: new FormControl(this.currentIngredient.weight, Validators.compose([
            Validators.minLength(0),
            Validators.required
          ]))
        });
      });
    }
  }

  // function to update or add ingredient
  edit() {
    this.currentIngredient = this.form.value;
    this.currentIngredient.priceCts = this.currentIngredient.priceCts * 100;
    this.currentIngredient.weight = this.currentIngredient.weight * 1;
    if (this.id) {
      this.ingredientService.update(this.currentIngredient, this.navParams.get('id'))
        .subscribe((data) => {
            this.navCtrl.setRoot(IngredientsListPage);
          },
          (err) => {
            //TODO
          });
    } else {
      this.ingredientService.add(this.form.value)
        .subscribe((data) => {
            this.navCtrl.setRoot(IngredientsListPage);
          },
          (err) => {
            //TODO
          });
    }
  }

  // remove this ingredient if updating
  remove() {
    if (this.id) {
      this.ingredientService.remove(this.id)
        .subscribe((data) => {
            if (data.response) {
              this.navCtrl.setRoot(IngredientsListPage);
            }
          },
          (err) => {
            //TODO
          });
    }
  }

}
