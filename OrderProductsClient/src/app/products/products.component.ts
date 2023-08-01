import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { AccountService } from '../services/account.service';
import { CartService } from '../services/cart.service';
import { AddCartItem } from '../models/cartItem';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartProducts: AddCartItem[] = [];
  searchModel = '';
  searchModelChanged = new Subject<string>();
  subscription: Subscription[] = [];

  constructor(private productsService: ProductService,
    private accountService: AccountService,
    private cartService: CartService, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.searchModelChanged.pipe(debounceTime(1000)).subscribe(search => {
      if (search.length >= 2) {
        this.subscription.push(this.productsService.searchProducts(search).subscribe(res =>
          this.products = res,
        ));
      }
      if (search.length === 0) {
        this.getAllProducts();
      }
    })
  }

  getAllProducts() {
    this.subscription.push(
      this.productsService.getProducts().subscribe({
        next: products => this.products = products,
        error: err => console.log(err)
      }));
  }

  onSearchChange(name: string) {
    this.searchModelChanged.next(name);
  }


  addToCart(product: Product) {
    if (this.accountService.currentUser$.value) {
      const cartItem: AddCartItem = {
        userId: +this.accountService.currentUser$.value.id,
        productId: product.id,
        quantity: 1
      }

      this.cartService.addProductToCart(cartItem).subscribe({
        next: response => {
          if (response) {
            console.log(response);
            this.cartProducts.push(response);
            this.toastr.success("Product added to cart");
            this.cartService.cartItemsCount().subscribe(() => { });
          }
        },
        error: error => console.log(error)
      });
    }
    else {
      this.router.navigate(['/login'])
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
