import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db : AngularFireDatabase) { }

  create(product) {
    this.db.list('/products').push(product);
  }

  getAll(): any{
    return this.db.list('/products').snapshotChanges();
  }

  get(productId) :any {
    return this.db.object('/products/' + productId).valueChanges();
  }

  update(productId, product) : any {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }

}
