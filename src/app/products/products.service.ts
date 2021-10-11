import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

const product_uri = 'http://localhost:8080/products';

const routes = {
  product: (c: ProductContext) => `${product_uri}/${c.id}`,
  products: () => `${product_uri}`,
};

export interface ProductContext {
  id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  seller: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  getProduct(context: ProductContext): Observable<Product> {
    return this.httpClient.get<Product>(routes.product(context));
  }

  listProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(routes.products());
  }

  saveProduct(product: Product): Observable<bigint> {
    return this.httpClient.post<bigint>(routes.products(), product);
  }
}
