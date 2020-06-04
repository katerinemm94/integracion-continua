import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    public toggleSpinner = new Subject<boolean>();
    public observableToggleSpinner$: Observable<boolean> = this.toggleSpinner.asObservable();

    constructor() {
    }

    showSpinner() {
        this.toggleSpinner.next( true );
    }

    hideSpinner() {
        this.toggleSpinner.next( false );
    }
}
