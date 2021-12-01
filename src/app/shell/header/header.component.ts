import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { MoneyAccountService } from '../../ecommerce/moneyAccount.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;
  @ViewChild("myNameElem")
  myNameElem!: ElementRef;
  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private moneyAccountService: MoneyAccountService,
  ) {
    moneyAccountService.$emitter.subscribe(() => {
      this.availableMoney()
    });
  }

  ngOnInit() {
    this.availableMoney()
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  availableMoney(){
    const login$ = this.moneyAccountService.availableMoney();
    login$
      .pipe(

      )
      .subscribe(
        (money: string) => {
          this.myNameElem.nativeElement.value = money;

        },
        (error) => {

          console.log("error")
        }
      );
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
