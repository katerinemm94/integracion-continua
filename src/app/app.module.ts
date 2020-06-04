import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

import { SnotifyModule } from 'ng-snotify';
import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { NgxSpinnerModule } from 'ngx-spinner';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,

    SnotifyModule,
    NgZorroAntdModule,
    NgxSpinnerModule,

    AuthModule,
    AdminModule,
    SharedModule
  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES }],
  bootstrap: [AppComponent]
})
export class AppModule { }
