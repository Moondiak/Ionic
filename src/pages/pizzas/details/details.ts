import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PizzaService} from '../../../service/pizza.service';
import {Pizza} from '../../../model/pizza';

@Component({
  selector: 'page-pizza-details',
  templateUrl: './details.html'
})
export class PizzaDetailsPage implements OnInit{
  public pizza: Pizza;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pizzaService: PizzaService) {
    this.pizza = new Pizza();
  }

  ngOnInit() {
    const id = this.navParams.get('id');
    this.pizzaService.getById(id).subscribe((data) => {
      this.pizza = data.response;
    });
  }

}
