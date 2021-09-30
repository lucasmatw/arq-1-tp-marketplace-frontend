import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

const routes = {
  product: (c: ProductContext) => `http://localhost:8080/products/${c.id}`,
};

export interface ProductContext {
  id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
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
}
