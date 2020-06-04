import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { GENERAL } from '@shared/constants/general.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginInfo } from '@shared/models/login-info.model';
import { Router } from '@angular/router';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { SpinnerService } from '@shared/services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public subscriptions: Subscription[] = [];

  public nombreAplicacion = GENERAL.NOMBRE_APLICACION;
  public loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  private loginInfo: LoginInfo;

  constructor(
    private deviceService: DeviceDetectorService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private router: Router,
    private ngNotifyService: NgNotifyService,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(document.body, 'bg-gradient-primary');

    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'bg-gradient-primary');
    this.subscriptions.forEach(suscription => {
      suscription.unsubscribe();
    });
  }

  onSubmit() {

    this.spinnerService.showSpinner();

    const deviceInfo: DeviceInfo = this.deviceService.getDeviceInfo();
    this.loginInfo = new LoginInfo(
      this.loginForm.get('userName').value,
      this.loginForm.get('password').value,
      `${deviceInfo.os} ${deviceInfo.os_version} - ${deviceInfo.browser} ${deviceInfo.browser_version}`
    );

    console.log(this.loginInfo);

    setTimeout(() => {

      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.router.navigate(['/admin']);
      this.ngNotifyService.success(`Bienvenido a ${GENERAL.NOMBRE_APLICACION}`);
      this.spinnerService.hideSpinner();

    }, 2000);

  }

}
