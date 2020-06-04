import { NgNotifyService } from '../services/ng-notify.service';

export class Base {

    constructor(public ngNotifyService: NgNotifyService) {
    }

    controlarMensajes(httpResponse?: any, service?: string) {
        if (httpResponse) {
            if (!httpResponse.response) {
                this.ngNotifyService.error(httpResponse.message);
                console.error(httpResponse.errors);
                return false;
            }

            if (httpResponse.response && !httpResponse.data) {
                this.ngNotifyService.error(`Ha ocurrido un error, comuníquese con el administrador`);
                console.error(httpResponse);
                return false;
            }

            return true;
        } else {
            if (service) {
                console.error(`${service}: la respuesta del servicio ha sido null`);
            }
            this.ngNotifyService.error(`Ha ocurrido un error, comuníquese con el administrador`);
            return false;
        }
    }

    controlarRespuestas(httpResponse?: any, service?: string) {
        if (httpResponse) {
            if (!httpResponse.response) {
                console.log(httpResponse.message);
                console.error(httpResponse.errors);
                return false;
            }

            if (httpResponse.response && !httpResponse.data) {
                console.log(`Ha ocurrido un error, comuníquese con el administrador`);
                console.error(httpResponse);
                return false;
            }

            return true;
        } else {
            if (service) {
                console.error(`${service}: la respuesta del servicio ha sido null`);
            }
            console.log(`Ha ocurrido un error, comuníquese con el administrador`);
            return false;
        }
    }

    submitFormErrors() {
        $('html, body').animate({
            scrollTop: 0
        });
        this.ngNotifyService.error('El formulario tiene algunos errores, verifique la información ingresada.');
    }

    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/jpeg' });
        return blob;
    }

}
