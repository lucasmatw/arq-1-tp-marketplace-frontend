import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { ChangePasswordComponent } from '../auth/change-password.component';
import { EcommerceComponent } from '../ecommerce/ecommerce.component';
import { ProductsComponent } from '@app/products/products.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: marker('Home') } },
    { path: 'changePassword', component: ChangePasswordComponent, data: { title: marker('ChangePassword') }},
    { path: 'products', component: ProductsComponent, data: { title: marker('products') }},
    { path: 'ecommerce', component: EcommerceComponent, data: { title: marker('ecommerce') }},
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
