import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Product, ProductsService } from '@app/products/products.service';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { HttpClient } from '@angular/common/http';
import { CredentialsService } from '@app/auth';

const log = new Logger('ShoppingComponent');



export interface Shopping {
  id: string;
  product: Product;
  buyer: Buyer;
  creation_date: string;
  quantity: number;
  status: string;
  price: number;
}
export interface Buyer {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  cuit: string;
}

const ELEMENT_DATA: Shopping[] = [];

@UntilDestroy()
@Component({
  selector: 'app-shopping-component',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
})
export class ShoppingComponent implements OnInit {
  products: Product[] = [];
  shoppings: Shopping[] = [];
  buyers: Buyer[] = [];
  shopping: Shopping | undefined;
  product: Product | undefined;
  buyer: Buyer | undefined;
  productSelected: Product | undefined;
  displayedColumns: string[] = ['id','name', 'seller', 'status', 'date', 'quantity', 'price'];
  dataSource = ELEMENT_DATA;
  faShoppingCart = faShoppingCart;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private http: HttpClient,
    private credentialsService: CredentialsService

  ) {

  }
  ngOnInit() {
    this.listShoppings()
  }


  listShoppings() {

    this.http.get<any>('/purchase?buyerEmail='+this.getAuthenticatedSeller()

       ).subscribe(data => {
        this.dataSource=data;
      });

  }

  private getAuthenticatedSeller(): string {
    const cred = this.credentialsService.credentials;
    if (!this.credentialsService.isAuthenticated() || cred == null) {
      log.error('Unauthorized user');
      throw new Error('Unauthorized user');
    }
    return cred.username;
  }


}
