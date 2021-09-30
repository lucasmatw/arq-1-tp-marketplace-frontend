import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { I18nModule } from '@app/i18n';

import { HelloComponent } from './hello.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, FlexLayoutModule, MaterialModule, ReactiveFormsModule],
  declarations: [HelloComponent],
  exports: [HelloComponent],
})
export class HelloModule {}
