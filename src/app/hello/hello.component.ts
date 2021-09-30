import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/auth';
import { Product, ProductContext, ProductsService } from '@app/hello/products.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss'],
})
export class HelloComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  productForm!: FormGroup;

  product: Product | undefined;
  pName: string = 'noname';
  pDesc: string = 'no desc';
  productContext: ProductContext | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productService: ProductsService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  save() {
    console.log('SAVE!' + this.productForm.value);
  }

  showProduct() {
    this.productContext = {
      id: '1',
    };

    this.productService
      .getProduct(this.productContext)
      // clone the data object, using its known Config shape
      .subscribe((data: Product) => {
        this.product = { ...data };
        this.pName = this.product.name;
        this.pDesc = this.product.description;
      });
  }

  private createForm() {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      remember: true,
    });
  }
}
