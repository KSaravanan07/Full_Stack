import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CategoryService } from '../category.service';
import { ProductService } from '../product.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  category: string;
  cart: any;
  subscription: Subscription;

  constructor(productService : ProductService, route: ActivatedRoute, private shoppingCartService : ShoppingCartService) {
    


    productService.getAll().pipe(switchMap((products : any) => {
      this.products = products;
      return route.queryParamMap;

    })).
    subscribe(params => {
      this.category = params.get('category');
      this.filteredProducts = (this.category) ?
      this.products.filter(p => p.payload.val().category === this.category) : this.products;
    });
  }

  async ngOnInit() {
    this.subscription =  (await (await this.shoppingCartService.getCart()).snapshotChanges()).subscribe(cart => this.cart = cart);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
