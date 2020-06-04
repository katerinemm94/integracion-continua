import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { ProductsComponent } from './components/products/products.component';
import { ProvidersComponent } from './components/providers/providers.component';

import { CreateEditProductComponent } from './components/products/create-edit-product/create-edit-product.component';
import { CreateEditProviderComponent } from './components/providers/create-edit-provider/create-edit-provider.component';

import { SharedModule } from '../shared/shared.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { DataTablesModule } from 'angular-datatables';
import { NgxImgModule } from 'ngx-img';

import { ProductService } from './components/products/services/product.service';
import { DetailProductComponent } from './components/products/detail-product/detail-product.component';
import { ProviderService } from './components/providers/services/provider.service';
import { DetailProviderComponent } from './components/providers/detail-provider/detail-provider.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    SidebarComponent,
    ProductsComponent,
    ProvidersComponent,
    CreateEditProductComponent,
    CreateEditProviderComponent,
    DetailProductComponent,
    DetailProviderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    SharedModule.forRoot(),
    NgxDatatableModule,
    NgZorroAntdModule,

    DataTablesModule,

    NgxImgModule.forRoot()
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    SidebarComponent,
    ProductsComponent,
    ProvidersComponent,
    CreateEditProductComponent,
    CreateEditProviderComponent,
  ],
  entryComponents: [DetailProductComponent, DetailProviderComponent],
  providers: [
    ProductService,
    ProviderService,
    { provide: NZ_I18N, useValue: es_ES }
  ],
})
export class AdminModule { }
