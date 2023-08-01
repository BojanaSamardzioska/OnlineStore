import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  email: string | undefined;
  numberOfProductsInCart: number = 0;
  subscription: Subscription;

  constructor(public accountService: AccountService, private cartService: CartService) {
    this.accountService.currentUser$.subscribe(user => {
      if (user) {
        this.loggedIn = true;
        this.email = user.email;
        this.getCartItemsCount();
      } else
        this.loggedIn = false;
        this.numberOfProductsInCart = 0;
    });

    this.subscription = this.cartService.cartItemsCount$.subscribe(count => {
      if (count)
        this.numberOfProductsInCart = count;
      else 
        this.numberOfProductsInCart = 0;
    });
  }

  ngOnInit(): void {
    this.getCartItemsCount();
  }

  logOut() {
    this.accountService.logOut();
  }

  getCartItemsCount() {
    if (this.accountService.currentUser$.value) {
      this.cartService.cartItemsCount().subscribe(() => {});
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
