import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';

import { NgNotifyService } from './services/ng-notify.service';
import { SpinnerService } from './services/spinner.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SnotifyModule,
  ],
  providers: [
    {
      provide: 'SnotifyToastConfig',
      useValue: ToastDefaults
    },
    NgNotifyService,
    SnotifyService,
    SpinnerService
  ]
})
export class SharedModule {
  public static forRoot(environment?: any): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        NgNotifyService,
        SnotifyService,
        {
          provide: 'SnotifyToastConfig',
          useValue: ToastDefaults
        },
        SpinnerService,
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment
        },
      ]
    };
  }

}
