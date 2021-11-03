import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from './authentication.service';

const log = new Logger('ChangePassword');

@UntilDestroy()
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  changePasswordForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
this.createChangePasswordForm();
  }

  ngOnInit() {}
  changePassword() {
    this.isLoading = true;
    const changePasswordForm$ = this.authenticationService.changePassword(this.changePasswordForm.value);
    changePasswordForm$
      .pipe(
        finalize(() => {
          this.changePasswordForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Register error: ${error}`);
          this.error = error;
        }
      );


  }
  private createChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      newpassword: ['', Validators.required],
      remember: true,
    });
  }

}
