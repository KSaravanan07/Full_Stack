import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart() {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId);
  }

  async addToCart(product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product) {
    this.updateItemQuantity(product, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }
  
  
  private getItem(cartId : string, productId : string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId)
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    })
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      let result = await this.create();
      localStorage.setItem('cartId', result.key);
      return result.key;
    }

    return cartId;
  }

  private async updateItemQuantity(product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ : any = this.getItem(cartId, product.key).snapshotChanges();
    let item$$ = this.getItem(cartId, product.key);
    
    item$.pipe(take(1)).subscribe(item => {
      if (item.payload.val()) {
        if(!(item.payload.val().quantity + change)) {
          (item$$).update({quantity: item.payload.val().quantity + change});
          item$$.remove();
        }
        else
          (item$$).update({quantity: item.payload.val().quantity + change});
    }
      else (item$$).set({product: product.payload.val(), quantity: 1});
    });
  }
}
