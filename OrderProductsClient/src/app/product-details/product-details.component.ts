import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { AccountService } from '../services/account.service';
import { CartService } from '../services/cart.service';
import { AddCartItem } from '../models/cartItem';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {
  product?: Product;
  cartProducts: AddCartItem[] = [];
  productQuantity: number = 1;

  constructor(private route: ActivatedRoute, private productService: ProductService,
    private accountService: AccountService, private cartService: CartService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.getProductDetails();
  }

  getProductDetails() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.productService.getProduct(+id).subscribe({
            next: response => this.product = response,
            error: error => console.log(error)
          });
        };
      }
    })
  }

  addToCart(product: Product) {
    if (this.accountService.currentUser$.value && this.productQuantity !== undefined) {
      const cartItem: AddCartItem = {
        userId: +this.accountService.currentUser$.value.id,
        productId: product.id,
        quantity: this.productQuantity
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
      this.router.navigate(['/login']);
    }
  }
}
