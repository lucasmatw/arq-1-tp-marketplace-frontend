import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from './authentication.service';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
    this.createRegisterForm();
  }

  ngOnInit() {}

  login() {
    console.log('a');
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          log.debug(`${credentials.username} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  resetPassword() {
    console.log('registrar');
    this.isLoading = true;
    const login$ = this.authenticationService.forgetPassword(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          log.debug(`${credentials.username} successfully logged in`);
          //this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          alert('La registraacion se realizo con exito. La password la recibe por mail.');
        },
        (error) => {
          log.debug(`Register error: ${error}`);
          this.error = error;
        }
      );
  }
  register() {
    console.log('registrar');
    this.isLoading = true;
    const login$ = this.authenticationService.register(this.registerForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          log.debug(`${credentials.username} successfully logged in`);
          //this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          this.registerForm.reset();
          alert('La registraacion se realizo con exito.\n La password la recibe por mail.');
        },
        (error) => {
          log.debug(`Register error: ${error}`);
          this.error = error;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
  private createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      cuit: ['', Validators.required],
    });
  }
}
