import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Product } from '@shared/models/products.model';
import { ProductService } from '../services/product.service';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { Base } from '@shared/base/base';
import { GENERAL } from '@shared/constants/general.constants';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent extends Base implements OnInit, OnDestroy {

  @Input() product: Product;
  @Output() outputEvent: EventEmitter<Product> = new EventEmitter<Product>();

  public imageBlobUrl: any;

  constructor(private productService: ProductService,
              public ngNotifyService: NgNotifyService) {
    super(ngNotifyService);
  }

  ngOnInit() {

    if ( this.product.thumbnailPhotoUrl ) {
      this.getThumbnail();
    } else {
      this.imageBlobUrl = GENERAL.IMAGES_DEFAULT.PRODUCTS;
    }

  }

  public someFunc() {
    this.outputEvent.emit(this.product);
  }

  ngOnDestroy(): void {
  }

  getThumbnail(): void {
    this.productService.getProductPhoto(this.product.thumbnailPhotoUrl)
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
