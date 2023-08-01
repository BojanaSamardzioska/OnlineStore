import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Product[]>(this.baseUrl + 'ProductsApi');
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + `ProductsApi/${id}`);
  }

  searchProducts(name: string) {
    return this.http.get<Product[]>(this.baseUrl + `ProductsApi/search/${name}`);
  }
}

