import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from '@app/products/products.service';
import { finalize } from 'rxjs/operators';
import { Logger, untilDestroyed } from '@shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CredentialsService } from '@app/auth';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const log = new Logger('Products');

@Component({
  selector: 'app-products',
  templateUrl: 'products.component.html',
  styleUrls: ['products.component.scss'],
})
@UntilDestroy()
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  product: Product | undefined;
  productForm!: FormGroup;
  displayedColumns: string[] = ['id','name', 'description', 'category', 'price', 'stock', 'seller','status','delete','edit'];
  faShoppingCart = faShoppingCart;

  categories: string[] = ['ELECTRICAL_APPLIANCE', 'FASHION', 'TECHNOLOGY'];

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService
  ) {
    this.listProducts();
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
    });
  }

  listProducts() {
    this.productService
      .listProducts(this.getAuthenticatedSeller())
      // clone the data object, using its known Config shape
      .subscribe((data: Product[]) => {
        this.products = data;
      });
  }


  saveProduct() {
    if (!this.productForm.valid) {
      throw new Error('Invalid product');
    }

    const product = this.productForm.value;

    product.seller = this.getAuthenticatedSeller();
    product.status = 'ACTIVE';

    const save$ = this.productService.saveProduct(product);
    save$
      .pipe(
        finalize(() => {
          log.debug('finalize!');
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (productId) => {
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Save error: ${error}`);
        }
      );
  }
  edit(productId: string) {
    this.productService.getProduct({ id: productId })
    .pipe(
      finalize(() => {
        log.debug('finalize!');
      }),
      untilDestroyed(this)
    )
    .subscribe(
      (productId : Product) => {
          console.log(productId)
          this.productForm.controls['id'].setValue(productId.id);
          this.productForm.controls['name'].setValue(productId.name);
          this.productForm.controls['description'].setValue(productId.description);
          this.productForm.controls['category'].setValue(productId.category);
          this.productForm.controls['price'].setValue(productId.price);
          this.productForm.controls['stock'].setValue(productId.stock);
                },
      (error) => {
        log.debug(`Save error: ${error}`);
      }
    );
}
  delete(productId: string) {
    this.productService.deleteProduct({ id: productId })
    .pipe(
      finalize(() => {
        log.debug('finalize!');
      }),
      untilDestroyed(this)
    )
    .subscribe(
      (productId) => {
        this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
      },
      (error) => {
        log.debug(`Save error: ${error}`);
      }
    );
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
