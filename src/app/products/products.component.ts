import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from '@app/products/products.service';
import { finalize } from 'rxjs/operators';
import { Logger, untilDestroyed } from '@shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CredentialsService } from '@app/auth';

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
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
    });
  }

  listProducts() {
    this.productService
      .listProducts()
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

  private getAuthenticatedSeller(): string {
    const cred = this.credentialsService.credentials;
    if (!this.credentialsService.isAuthenticated() || cred == null) {
      log.error('Unauthorized user');
      throw new Error('Unauthorized user');
    }
    return cred.username;
  }
}
