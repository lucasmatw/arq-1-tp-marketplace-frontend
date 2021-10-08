import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from '@app/products/products.service';
import { finalize } from 'rxjs/operators';
import { Logger, untilDestroyed } from '@shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';

const log = new Logger('Products');

@Component({
  selector: 'app-products',
  templateUrl: 'products.component.html',
  styleUrls: ['products.component.scss'],
})
@UntilDestroy()
export class ProductsComponent implements OnInit {
  products: Product[] = [{ name: 'hola', category: 'alo', description: 'eee', id: 'e' }];
  product: Product = { name: 'hola', category: 'alo', description: 'eee', id: 'e' };
  productForm!: FormGroup;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.listProducts();
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      category: [null, Validators.required],
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
    const product = this.productForm.value;
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
          log.debug('PRODUCT! ' + productId);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Save error: ${error}`);
        }
      );
  }
}
