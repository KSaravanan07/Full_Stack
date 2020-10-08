import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CategoryService } from '../category.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories$;
  category: string;

  constructor(productService : ProductService, categoryService : CategoryService, route: ActivatedRoute) {
    productService.getAll().pipe(switchMap((products : any) => {
      this.products = products;
      return route.queryParamMap;

    })).
    subscribe(params => {
      this.category = params.get('category');
      this.filteredProducts = (this.category) ?
      this.products.filter(p => p.payload.val().category === this.category) : this.products;
    });

    this.categories$ = categoryService.getCategories().snapshotChanges();
  }

  ngOnInit(): void {
  }

}
