import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {IngredientService} from '../../../service/ingredient.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Pizza} from '../../../model/pizza';
import {PizzaService} from '../../../service/pizza.service';
import {PizzasListPage} from '../list/list';
import {Camera} from "@ionic-native/camera";
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-pizza-edit',
  templateUrl: './edit.html'
})
export class PizzaEditPage implements OnInit{

  public form: FormGroup;
  public currentPizza: any;
  public id: string;
  public picture = '';
  public ingredients = [];
  public haveIngredients = false;
  public error: boolean;

  constructor(private pizzaService: PizzaService,
              private ingredientService: IngredientService,
              public authService: AuthService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public sanitizer: DomSanitizer,
              public camera: Camera) {
    this.id = this.navParams.get('id');
  }

  ngOnInit() {
    this.error = false;
    this.currentPizza = new Pizza();
    this.ingredientService.get().subscribe((data) => {
      data.response.forEach((ingredient) => {
        this.ingredients.push({item: ingredient, checked: false});
      });
    });

    // initialize form
    this.form = new FormGroup({
      name: new FormControl(this.currentPizza.name, Validators.compose([
        Validators.minLength(0),
        Validators.required
      ])),
      priceCts: new FormControl(this.currentPizza.priceCts, Validators.compose([
        Validators.minLength(0),
        Validators.required
      ])),
      description: new FormControl(this.currentPizza.description, Validators.compose([
        Validators.minLength(0),
        Validators.maxLength(500),
        Validators.required
      ])),
      image: new FormControl(this.picture)
    });

    // if update
    if (this.id) {
      this.pizzaService.getById(this.id).subscribe((data) => {
        this.currentPizza = data.response;
        this.currentPizza.priceCts = this.currentPizza.priceCts / 100;
        this.setDefaultIngredients();

        this.form = new FormGroup({
          name: new FormControl(this.currentPizza.name, Validators.compose([
            Validators.minLength(0),
            Validators.required
          ])),
          priceCts: new FormControl(this.currentPizza.priceCts, Validators.compose([
            Validators.minLength(0),
            Validators.required
          ])),
          description: new FormControl(this.currentPizza.description, Validators.compose([
            Validators.minLength(0),
            Validators.maxLength(500),
            Validators.required
          ])),
          image: new FormControl(this.picture)
        });
      });
    }
  }

  // On change in checkbox's ingredients state
  change() {
    this.haveIngredients = this.ingredients.some(ingredient => ingredient.checked === true);
  }

  // function to send updated or new pizza
  edit() {
    const oldPicture = this.currentPizza.image;
    this.currentPizza = this.form.value;

    this.currentPizza.priceCts = this.currentPizza.priceCts * 100;
    if (!this.picture) {
      this.currentPizza.image = oldPicture;
    } else {
      this.currentPizza.image = this.picture;
    }
    this.currentPizza._id = this.id;
    this.currentPizza.ingredients = [];
    this.ingredients.forEach((ingredient) => {
      if (ingredient.checked) {
        this.currentPizza.ingredients.push(ingredient.item._id);
      }
    });

    if (this.currentPizza._id) {
      this.pizzaService.update(this.currentPizza, this.navParams.get('id'))
        .subscribe((data) => {
            this.navCtrl.setRoot(PizzasListPage);
          },
          (err) => {
            //TODO
          });
    } else {
      this.pizzaService.add(this.currentPizza)
        .subscribe((data) => {
            this.navCtrl.setRoot(PizzasListPage);
          },
          (err) => {
            //TODO
          });
    }
  }

  // select default pizza's ingredients
  setDefaultIngredients() {
    this.currentPizza.ingredients.forEach((ingredient) => {
      const index = this.ingredients.findIndex(ingrdt => ingrdt.item._id === ingredient._id);
      if (index !== -1) {
        this.ingredients[index].checked = true;
      }
    });
    this.change();
  }

  // delete pizza
  remove() {
    if (this.currentPizza._id) {
      this.pizzaService.remove(this.navParams.get('id'))
        .subscribe((data) => {
            if (data.response) {
              this.navCtrl.setRoot(PizzasListPage);
            }
          },
          (err) => {
            //TODO
          });
    }
  }

  takePicture() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }).then((imageData) => {
      this.currentPizza.image = 'data:image/jpeg;base64,' + imageData;
      this.picture = this.currentPizza.image;
    }, (err) => {
      //TODO
    });
  }
}
