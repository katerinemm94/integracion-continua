import { Injectable } from '@angular/core';
import {SnotifyService, SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';
import { SnotifyType } from 'ng-snotify/snotify/types/snotify.type';

@Injectable({
  providedIn: 'root'
})
export class NgNotifyService {

  style = 'material';
  title = 'Snotify title!';
  body = 'Lorem ipsum dolor sit amet!';
  timeout = 5000;
  position: SnotifyPosition = SnotifyPosition.rightBottom;
  progressBar = true;
  closeClick = true;
  newTop = true;
  backdrop = -1;
  dockMax = 8;
  blockMax = 6;
  pauseHover = true;
  titleMaxLength = 15;
  bodyMaxLength = 300;

  constructor(private snotifyService: SnotifyService) {
  }

   /*
  Change global configuration
   */
  getConfig(): SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }

  confirm(message: string, okCallback: () => any, type: SnotifyType = 'error') {
    this.snotifyService.html(`<div class="snotifyToast__title"><b>Mensaje de confirmación</b></div>
    <div class="snotifyToast__body">${message}</div>`, {
      timeout: 8000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {text: 'Confirmar', action: (toast) => { okCallback(); this.snotifyService.remove(toast.id); }, bold: false},
        {text: 'Cancelar', action: (toast) => {console.log('Clicked: Close'); this.snotifyService.remove(toast.id); }, bold: true},
      ],
      type: type as SnotifyType
    });
  }

  confirm_success(message: string, okCallback: () => any) {
    this.snotifyService.html(`<div class="snotifyToast__title"><b>Mensaje de confirmación</b></div>
    <div class="snotifyToast__body">${message}</div>`, {
      timeout: 8000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {text: 'Confirmar', action: (toast) => { okCallback(); this.snotifyService.remove(toast.id); }, bold: false},
        {text: 'Cancelar', action: (toast) => {console.log('Clicked: Close'); this.snotifyService.remove(toast.id); }, bold: true},
      ],
      type: 'success'
    });
  }


  success(message: string) {
    this.snotifyService.success(message, this.getConfig());
  }

  error(message: string) {
    this.snotifyService.error(message, this.getConfig());
  }

  warning(message: string) {
    this.snotifyService.warning(message, this.getConfig());
  }

  info(message: string) {
    this.snotifyService.info(message, this.getConfig());
  }

  message(message: string) {
    this.snotifyService.simple(message, this.getConfig());
  }
}
