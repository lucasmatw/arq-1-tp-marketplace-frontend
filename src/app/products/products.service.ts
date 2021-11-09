import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

const product_uri = '/products';

const routes = {
  product: (c: ProductContext) => `${product_uri}/${c.id}`,
  products: () => `${product_uri}`,
};

export interface ProductContext {
  id: string;
}


export interface ProductSearchContext {
  data: string;
}


export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  seller: string;
  stock: number;
  status: string;
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

  listProducts(seller:String): Observable<Product[]> {
    return this.httpClient.get<Product[]>( '/products' + '?' + 'seller='+seller, {responseType:'json'});
  }
  searchProducts(name: String,category: String,min: String,max: String): Observable<Product[]> {
    return this.httpClient.get<Product[]>( '/products/search' + '?' + 'name='+name+ '&' + 'category='+category+ '&' + 'min_price='+min+ '&' + 'max_price='+max, {responseType:'json'});

  }

  saveProduct(product: Product): Observable<bigint> {
    return this.httpClient.post<bigint>(routes.products(), product);
  }

  deleteProduct(context: ProductContext): Observable<boolean> {
    console.log("aaa")

    return this.httpClient.delete<boolean>( '/products/' + context.id  );

  }
}
