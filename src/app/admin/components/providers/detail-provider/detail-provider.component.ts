import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Provider } from '@shared/models/providers.model';
import { ProviderService } from '../services/provider.service';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { Base } from '@shared/base/base';
import { GENERAL } from '@shared/constants/general.constants';

@Component({
  selector: 'app-detail-provider',
  templateUrl: './detail-provider.component.html',
  styleUrls: ['./detail-provider.component.scss']
})
export class DetailProviderComponent extends Base implements OnInit, OnDestroy {

  @Input() provider: Provider;
  @Output() outputEvent: EventEmitter<Provider> = new EventEmitter<Provider>();

  public imageBlobUrl: any;

  constructor(private providerService: ProviderService,
              public ngNotifyService: NgNotifyService) {
    super(ngNotifyService);
  }

  ngOnInit() {

    if ( this.provider.primaryPhotoURL ) {
      this.getThumbnail();
    } else {
      this.imageBlobUrl = GENERAL.IMAGES_DEFAULT.PROVIDERS;
    }

  }

  public someFunc() {
    this.outputEvent.emit(this.provider);
  }

  ngOnDestroy(): void {
  }

  getThumbnail(): void {
    this.providerService.getProviderPhoto(this.provider.primaryPhotoURL)
      .subscribe(
        (response) => {

          if (response instanceof Blob) {
            this.createImageFromBlob(response);
          } else {
            this.controlarMensajes(
              response,
              'getThumbnail');
          }
        },
        response => {
          console.log('POST in error', response);
          this.imageBlobUrl = GENERAL.IMAGES_DEFAULT.PRODUCTS;
        },
        () => {
          console.log('POST observable is now completed.');
        });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageBlobUrl = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }


}


