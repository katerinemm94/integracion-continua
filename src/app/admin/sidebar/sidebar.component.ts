import { Component, OnInit } from '@angular/core';
import { GENERAL } from '@shared/constants/general.constants';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public nombreAplicacion = GENERAL.NOMBRE_APLICACION;

  constructor() { }

  ngOnInit() {
  }

  public sidebarToggle() {
    $('body').toggleClass('sidebar-toggled');
    $('.sidebar').toggleClass('toggled');
    if ($('.sidebar').hasClass('toggled')) {
      $('.sidebar .collapse').collapse('hide');
    }
  }

}
