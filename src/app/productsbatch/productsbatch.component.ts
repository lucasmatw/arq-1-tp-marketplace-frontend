import { Component, OnInit } from '@angular/core';
import {  ProductsBatchService } from '@app/productsbatch/productsbatch.service';
import { finalize } from 'rxjs/operators';
import { Logger, untilDestroyed } from '@shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CredentialsService } from '@app/auth';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
const log = new Logger('ProductsBatch');

@Component({
  selector: 'app-productsbatch',
  templateUrl: 'productsbatch.component.html',
  styleUrls: ['productsbatch.component.scss'],
})
@UntilDestroy()
export class ProductsBatchComponent implements OnInit {

  SERVER_URL = "/products/batch";
  uploadForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, private httpClient: HttpClient,
    private credentialsService: CredentialsService,
    private router: Router,
    private route: ActivatedRoute


  ) {
  }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
  }
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile')!.setValue(file);
    }
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile')!.value);
    formData.append('sellerMail', this.getAuthenticatedSeller());

    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) =>           this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true })      ,
      (err) => console.log(err)
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
