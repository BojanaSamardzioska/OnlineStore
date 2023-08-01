import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cartItem';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartSum: number | undefined;

  constructor(private cartService: CartService, private accountService: AccountService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.getAllCartItems();
  }

  getAllCartItems() {
    if (this.accountService.currentUser$.value) {
      this.cartService.getCartItems().subscribe({
        next: response => {
          if (response) {
            this.cartItems = response;
            this.cartService.cartItemsCount().subscribe(() => { });
            this.finalPrice();
          }
        },
        error: error => console.log(error)
      });
    }
  }

  removeItemFromCart(item: CartItem) {
    if (this.accountService.currentUser$.value) {
      this.cartService.removeItemFromCart(item.productId).subscribe({
        next: response => {
          if (response) {
            this.toastr.success("Product removed from cart");
            this.getAllCartItems();
            this.finalPrice();
          }
        },
        error: error => console.log(error)
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  removeItemsFromCart() {
    if (this.accountService.currentUser$.value) {
      this.cartService.removeAllItemsFromCart().subscribe({
        next: response => {
          if (response) {
            this.toastr.success("Your checkout has been successful");
            this.getAllCartItems();
            this.finalPrice();
          }
        },
        error: error => console.log(error)
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private finalPrice() {
    if (this.accountService.currentUser$.value) {
      this.cartService.getCartItems().subscribe({
        next: response => {
          if (response) {
            const total = response.reduce((acc, item) => 
              acc += item.price * item.quantity, 0);
            this.cartSum = total;
          }
        },
        error: error => console.log(error)
      });
    }
  }
}
