import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '', component: ProductsComponent
  },
  {
    path: 'login', component: UserLoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'product-details/:id', component: ProductDetailsComponent
  },
  {
    path: 'cart', component: CartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
