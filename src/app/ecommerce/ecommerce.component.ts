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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MoneyAccountService } from './moneyAccount.service';

const log = new Logger('EcommerceComponent');




const product1 : Product={
  id: "1",
  "name": "Producto",
  "description": "Hola",
  "category": "Tecno",
  "price": 1,
  "seller": "diazmaxi@gmail.com",
  "stock": 1,
  "status": "ACTIVE"
}
const ELEMENT_DATA: Product[] = [product1];

@UntilDestroy()
@Component({
  selector: 'app-ecommerce-component',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
})
export class EcommerceComponent implements OnInit {
  products: Product[] = [];
  product: Product | undefined;
  productSelected: Product | undefined;
  displayedColumns: string[] = ['id','name', 'description', 'category', 'price', 'stock', 'seller', 'status','symbol'];
  dataSource = ELEMENT_DATA;
  faShoppingCart = faShoppingCart;
  isNotDisplayedPurchase = true
  isNotDisplayedProducts= false
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private http: HttpClient,
    private credentialsService: CredentialsService,
    private moneyAccountService:MoneyAccountService


  ) {

  }
  ngOnInit() {
this.listProducts()
  }
  purchase(){
    let quantity = (<HTMLInputElement>document.getElementById("quantity")).value
    if (parseInt(quantity) <= this.productSelected!.stock){
      this.http.post<any>(`/purchase`,
      {"product_id": this.productSelected?.id,
       "buyer_email": this.getAuthenticatedSeller(),
       "quantity": quantity }
       ).subscribe(data => {
        this.isNotDisplayedPurchase=true
        this.isNotDisplayedProducts = false
        this.listProducts()
        this.moneyAccountService.emitirEvento()
        alert("compra realizada exitosamente")
      });
    }else{
      alert("La cantidad supera el maximo disponible")
    }

  }

prePurchase(product:Product){
    this.productSelected! = product
    this.isNotDisplayedPurchase=false
    this.isNotDisplayedProducts = true
  }
  listProducts() {
    this.productService
      .searchProducts(

        (<HTMLInputElement>document.getElementById("name")).value,
        (<HTMLInputElement>document.getElementById("category")).value,
        (<HTMLInputElement>document.getElementById("min")).value,
        (<HTMLInputElement>document.getElementById("max")).value



        )
      // clone the data object, using its known Config shape
      .subscribe(data => {
        //this.products = data;
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
