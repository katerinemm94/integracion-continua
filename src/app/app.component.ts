import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private spinnerService: SpinnerService) {
  }

  title = 'taller-motos';

  ngOnInit() {
    this.spinnerService.observableToggleSpinner$.subscribe( toggleSpinner => {

      if ( toggleSpinner ) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }

    });
  }
}
