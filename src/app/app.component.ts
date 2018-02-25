import { Component, ViewChild } from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {PizzasListPage} from '../pages/pizzas/list/list';
import {IngredientsListPage} from '../pages/ingredients/list/list';

@Component({
  templateUrl: 'app.html'
})
export class TMNT {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PizzasListPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen) {
    this.initializeApp();

    this.pages = [
      { title: 'Pizzas', component: PizzasListPage },
      { title: 'Ingredients', component: IngredientsListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.options){
      this.nav.setRoot(page.component, page.options);
    }else{
      this.nav.setRoot(page.component);
    }
  }
}
