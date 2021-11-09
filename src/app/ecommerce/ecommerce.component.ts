import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Product, ProductsService } from '@app/products/products.service';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';

const log = new Logger('EcommerceComponent');





const ELEMENT_DATA: Product[] = [];

@UntilDestroy()
@Component({
  selector: 'app-ecommerce-component',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
})
export class EcommerceComponent implements OnInit {
  products: Product[] = [];
  product: Product | undefined;

  displayedColumns: string[] = ['id','name', 'description', 'category', 'price', 'stock', 'seller', 'status','symbol'];
  dataSource = ELEMENT_DATA;
  faShoppingCart = faShoppingCart;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productService: ProductsService,

  ) {

  }
  ngOnInit() {
this.listProducts()
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




}
