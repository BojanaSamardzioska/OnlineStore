import { Injectable } from '@angular/core';
import { AddCartItem, CartItem } from '../models/cartItem';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  baseUrl = environment.apiUrl;
  cartItemsCount$ = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) { }

  getCartItems() {
    return this.http.get<CartItem[]>(this.baseUrl + 'cartapi/cart-products');
  }

  addProductToCart(cartItem: AddCartItem) {
    return this.http.post<AddCartItem>(this.baseUrl + 'cartapi/add-to-cart', cartItem);
  }

  removeItemFromCart(id: number) {
    return this.http.delete<CartItem>(this.baseUrl + `cartapi/delete-cart-item/${id}`);
  }

  removeAllItemsFromCart() {
    return this.http.delete<CartItem[]>(this.baseUrl + 'cartapi/delete-cart-items');
  }

  cartItemsCount() {
    return this.http.get<number>(this.baseUrl + 'cartapi/count').pipe(
      map(count => this.cartItemsCount$.next(count))
    );
  }
}
