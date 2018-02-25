import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {NavbarService} from '../../../service/navbar.service';
import {PizzaService} from '../../../service/pizza.service';
import {Pizza} from '../../../model/pizza';
import {PizzaEditPage} from '../edit/edit';
import {PizzaDetailsPage} from '../details/details';

@Component({
  selector: 'page-pizzas',
  templateUrl: './list.html'
})
export class PizzasListPage implements OnInit, OnDestroy{

  public pizzas: Pizza[];
  public sortField: string;
  public sortDirection: boolean;
  private connection;
  public error: boolean;

  constructor(private pizzaService: PizzaService,
              private nav: NavbarService,
              public navCtrl: NavController) {
    this.sortDirection = false;
    this.sortField = 'name';
  }

  ngOnInit() {
    this.nav.show();
    this.nav.refreshStateLogged();
    this.error = false;
    this.pizzaService.get().subscribe((data) => {
      this.pizzas = data.response;
    });
    this.connection = this.pizzaService.listen().subscribe((data) => {
      if (data.type === 'remove') {
        this.pizzas = this.pizzas.filter((pizza) => {
          return pizza._id !== data.item;
        });
      } else if (data.type === 'update') {
        this.pizzas.forEach((pizza, i) => {
          if (data.item._id === pizza._id) {
            this.pizzas[i] = data.item;
          }
        });
      } else if (data.type === 'add') {
        this.pizzas.push(data.item);
      }
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  // remove one pizza
  remove(id) {
    this.pizzaService.remove(id).subscribe((data) => {
      },
      (err) => {
        if (!err.response) {
          this.error = true;
        }
      });
  }

  edit(id) {
    this.navCtrl.push(PizzaEditPage, {id: id});
  }

  add() {
    this.navCtrl.push(PizzaEditPage);
  }

  details(id) {
    this.navCtrl.push(PizzaDetailsPage, {id: id});
  }

}
