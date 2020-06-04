import { Component, OnInit } from '@angular/core';
import { GENERAL } from 'src/app/shared/constants/general.constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public nombreAplicacion = GENERAL.NOMBRE_APLICACION;
  public anio = (new Date()).getFullYear();
  public version = GENERAL.VERSION;

  constructor() { }

  ngOnInit() {
  }

}
