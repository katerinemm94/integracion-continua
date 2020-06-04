import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { GENERAL } from '@shared/constants/general.constants';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public subscriptions: Subscription[] = [];

  constructor(private renderer: Renderer2,
              private ngNotifyService: NgNotifyService,
              private router: Router) {
    this.renderer.addClass(document.body, 'page-top');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'page-top');
    this.subscriptions.forEach(suscription => {
      suscription.unsubscribe();
    });
  }

  cerrarSesion() {
    $('#logoutModal').modal('hide');
    this.ngNotifyService.success(`Esperamos verte de nuevo, equipo ${GENERAL.NOMBRE_APLICACION}`);
    this.router.navigate(['']);
  }

}
