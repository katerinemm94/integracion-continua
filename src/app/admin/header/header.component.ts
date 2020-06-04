import { Component, OnInit, OnDestroy } from '@angular/core';

import { SignUpInfo } from '@shared/models/sign-up-info.model';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public informacionUsuario: SignUpInfo = null;
  public subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {

    const usuario: SignUpInfo = new SignUpInfo('Dulce Galeano Martinez', 'dulcemariagm', 'dulcegm0210@gmail.com', '123');
    this.informacionUsuario = usuario;

  }

  ngOnDestroy() {
    this.subscriptions.forEach( suscription => {
      suscription.unsubscribe();
    });
  }

}
