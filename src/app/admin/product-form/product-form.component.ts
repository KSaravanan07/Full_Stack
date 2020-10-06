import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AngularFireList } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CategoryService } from 'src/app/category.service';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product = {
    title: null, 
    price: null,
    imageUrl: null,
    category: null
  };

  constructor(private router: Router, private categoryService: CategoryService, private productService: ProductService, private route: ActivatedRoute) {
    this.categories$ = categoryService.getCategories().snapshotChanges();

    let id = this.route.snapshot.paramMap.get('id');
    if(id) this.productService.get(id).pipe(take(1)).subscribe(p => this.product = p);
  }

  save(product) {


    this.productService.create(product);
    this.router.navigate(['/admin/products'], {relativeTo: this.route});
  }

  ngOnInit(): void {
  }

}
