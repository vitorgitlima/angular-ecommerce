import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[];
 
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
 
  constructor() {
    this.cartItems = JSON.parse(sessionStorage.getItem('cartItems')) ? JSON.parse(sessionStorage.getItem('cartItems')) : [];
  }
 
  addToCart(theCartItem: CartItem) {
 
    // Check if item is in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;
 
    if (this.cartItems.length > 0) {
      // Find item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
 
      // Check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }
 
    if (alreadyExistsInCart) {
      existingCartItem.quantity++
    } else {
      this.cartItems.push(theCartItem)
    }
 
    this.computeCartTotals();
 
  }
 
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
 
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += (currentCartItem.quantity * currentCartItem.unitPrice);
      totalQuantityValue += currentCartItem.quantity;
    }
 
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
 
    this.logCartData(totalPriceValue, totalQuantityValue);
    this.persistCartItems();
 
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
 
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue} `)
    console.log(`-----`)
  }

  persistCartItems() {
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}