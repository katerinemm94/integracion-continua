
import { ResponseAPI } from '@shared/models/responseAPI.model';
import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  SimpleChange,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { GENERAL_MESSAGES_VALIDATIONS } from '@shared/validations/general-messages.validations';
import { PACKAGING_TYPES, PACKAGING_TYPES_OBJECT } from '@shared/models/packaging-types.model';
import {
  validarDecimales,
  validarCampoNumerico
} from '@shared/validations/general.validations';
import { Product } from '@shared/models/products.model';
import { ProductService } from '@admin/components/products/services/product.service';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { Base } from '@shared/base/base';
import { Subscription, Observable, Subject, of, timer } from 'rxjs';
import { NgxImgComponent } from 'ngx-img';
import { TEXTO_CROPPER, OPCIONES_CROPPER_PRODUCTO, ERRORES_CROPPER, GENERAL } from '@shared/constants/general.constants';
import { flatMap, map, tap, switchMap, startWith, filter, take } from 'rxjs/operators';
import { ProductPhoto, ProductPhotoResponse } from '../../../../shared/models/products.model';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.scss']
})
export class CreateEditProductComponent extends Base implements OnInit, OnChanges, OnDestroy {

  public formSubmitSubject$: Subject<any>;

  public subscriptions: Subscription[] = [];

  @Input() productEdit: Product;
  @Output() productSaved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() productEditClear: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('fotoProducto') fotoProducto: NgxImgComponent;

  public generalMessages = GENERAL_MESSAGES_VALIDATIONS;
  public packagingTypes = PACKAGING_TYPES;
  public validateForm: FormGroup;
  public textoTituloFormulario: string;

  public imagenSrc: any = [];
  public imagenValida = false;

  public textoCropper = TEXTO_CROPPER;
  public opcionesCropper = OPCIONES_CROPPER_PRODUCTO;
  public erroresCropper = ERRORES_CROPPER;

  constructor(
    private productService: ProductService,
    public ngNotifyService: NgNotifyService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder
  ) {
    super(ngNotifyService);
    this.validateForm = this.fb.group({
      code: ['', [Validators.maxLength(255)], this.validateCodeNotTaken.bind(this)],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      unitPrice: [null, [Validators.required, Validators.maxLength(10), validarDecimales()]],
      boxPrice: [{ value: 0, disabled: true }, [Validators.required, Validators.maxLength(10), validarDecimales()]],
      quantityPerBox: [null, [Validators.required, validarCampoNumerico()]],
      packagingType: [PACKAGING_TYPES_OBJECT.ARMADO.id, [Validators.required, validarCampoNumerico()]],
      numberModels: [1, [validarCampoNumerico()]],
      notes: ['', [Validators.maxLength(250)]]
    });
    this.textoTituloFormulario = 'Crear producto';
    this.formSubmitSubject$ = new Subject();
  }

  ngOnInit() {
    this.setFormValuesEdit();

    /**
     *
     * Angular no espera a que se realicen validaciones asíncronas.
     * No se completan antes de disparar ngSubmit, por lo tanto,
     * el formulario puede ser inválido si los validadores no han resuelto.
     *
     * Usando un Subject para emitir envíos de formularios, puede verificar
     * los cambios con form.statusChange y filtrar los resultados.
     *
     * Comience con un startWith para asegurarse de que no hay emisiones
     * colgantes, en el caso de que el formulario sea válido en el momento de la presentación.
     *
     * El filtrado por PENDING espera a que este estado cambie, y take(1)
     * se asegura de que el flujo se complete en la primera emisión.
     * Después de validar que no este pendiente, valida el estado de: VALID o INVALID
     *
     */
    this.subscriptions.push(
      this.formSubmitSubject$
        .pipe(
          tap(() => this.verifyValidators()),
          switchMap(() =>
            this.validateForm.statusChanges.pipe(
              startWith(this.validateForm.status),
              filter(status => status !== 'PENDING'),
              take(1)
            )
          ),
          // filter(status => status === 'VALID')
        )
        .subscribe(validationSuccessful => {
          console.log(validationSuccessful);
          this.submitForm();
        })
    );

    this.calcBoxPrice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const productEdit: SimpleChange = changes.productEdit;
      if (productEdit.currentValue) {
        this.productEdit = productEdit.currentValue;
        this.setFormValuesEdit();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(suscription => {
      suscription.unsubscribe();
    });
  }

  private calcBoxPrice() {

    this.subscriptions.push(
      this.validateForm.get('unitPrice').valueChanges.subscribe((value) => {
        const boxPrice = ((value && this.validateForm.get('unitPrice').valid) ? value : 0) *
        ((this.validateForm.get('quantityPerBox').value && this.validateForm.get('quantityPerBox').valid)
        ? this.validateForm.get('quantityPerBox').value : 0);

        this.validateForm.get('boxPrice').setValue(boxPrice.toFixed(2));
      })
    );

    this.subscriptions.push(
      this.validateForm.get('quantityPerBox').valueChanges.subscribe((value) => {
        const boxPrice = ((value && this.validateForm.get('quantityPerBox').valid) ? value : 0) *
        ((this.validateForm.get('unitPrice').value && this.validateForm.get('unitPrice').valid)
        ? this.validateForm.get('unitPrice').value : 0);

        this.validateForm.get('boxPrice').setValue(boxPrice.toFixed(2));
      })
    );

  }

  private validateCodeNotTaken(control: AbstractControl) {

    if (!control.value) {
      return of(null);
    }

    if (this.productEdit) {

      if (control.value.toUpperCase() === (this.productEdit.code ? this.productEdit.code.toUpperCase() : this.productEdit.code)) {
        return of(null);
      }

    }

    const code = control.value.toUpperCase();

    return timer(500).pipe(
      switchMap(() => {
        return this.productService.getProductByCode(code).pipe(
          map((response: ResponseAPI<Product>) => {
            return response.response ? { codeTaken: true } : null;
          }));
      })
    );
  }

  public setFormValuesEdit() {
    if (this.productEdit) {
      this.textoTituloFormulario = 'Editar producto';
      this.validateForm.get('code').setValue(this.productEdit.code);
      this.validateForm.get('description').setValue(this.productEdit.description);
      this.validateForm.get('unitPrice').setValue(this.productEdit.unitPrice.toString().replace(',', '.'));
      this.validateForm.get('boxPrice').setValue(this.productEdit.boxPrice.toString().replace(',', '.'));
      this.validateForm.get('quantityPerBox').setValue(Number(this.productEdit.quantityPerBox));
      this.validateForm.get('packagingType').setValue(Number(this.productEdit.packagingType));
      this.validateForm.get('numberModels').setValue(Number(this.productEdit.numberModels));
      this.validateForm.get('notes').setValue(this.productEdit.notes);
      this.verifyValidators();
    }
  }

  public submitForm(): void {
    if (this.validateForm.valid) {
      this.spinnerService.showSpinner();

      const product: Product = this.productEdit ? this.productEdit : new Product();
      product.code = this.validateForm.get('code').value ? this.validateForm.get('code').value : null;
      product.description = this.validateForm.get('description').value;
      product.unitPrice = this.validateForm.get('unitPrice').value;
      product.boxPrice = this.validateForm.get('boxPrice').value;
      product.quantityPerBox = this.validateForm.get('quantityPerBox').value;
      product.packagingType = this.validateForm.get('packagingType').value;
      product.numberModels = this.validateForm.get('numberModels').value;
      product.notes = this.validateForm.get('notes').value;

      if (this.productEdit) {
        this.saveProduct(product, GENERAL.UPDATE);
      } else {
        this.saveProduct(product, GENERAL.NEW);
      }
    } else {
      this.submitFormErrors();
    }
  }

  /**
   * Método para guardar los productos en base de datos
   * @param product product producto que se guarda en base de datos
   * @param newOrUpdate parametro que indica si es un producto nuevo o se debe actualizar
   */
  private saveProduct(product: Product, newOrUpdate: string = GENERAL.NEW) {

    product.code = product.code ? product.code.toUpperCase() : product.code;

    this.subscriptions.push(
      (newOrUpdate === GENERAL.NEW ? this.productService
        .createProduct(product) : this.productService
          .updateProduct(product))
        .pipe(
          flatMap((httpResponse: ResponseAPI<Product>) => {
            if (this.controlarRespuestas(httpResponse, 'saveProduct')) {
              if (this.imagenValida) {

                const formData = new FormData();
                formData.append('image', this.getImage());
                return this.productService.uploadProduct(formData, httpResponse.data.id).pipe(
                  map((httpResponseUploadPhoto: ResponseAPI<ProductPhoto>) => {
                    const productPhotoResponse = new ProductPhotoResponse();
                    productPhotoResponse.responseProduct = httpResponse;
                    productPhotoResponse.responseProductPhoto = httpResponseUploadPhoto;
                    productPhotoResponse.photoAttachedProduct = true;
                    return productPhotoResponse;
                  })
                );

              } else {
                const observableCreateProduct = new Observable<ProductPhotoResponse>((observer) => {
                  const productPhotoResponse = new ProductPhotoResponse();
                  productPhotoResponse.responseProduct = httpResponse;
                  productPhotoResponse.responseProductPhoto = null;
                  productPhotoResponse.photoAttachedProduct = false;
                  observer.next(productPhotoResponse);
                  observer.complete();
                });
                return observableCreateProduct;
              }
            } else {
              const observableCreateProduct = new Observable<ProductPhotoResponse>((observer) => {
                const productPhotoResponse = new ProductPhotoResponse();
                productPhotoResponse.responseProduct = httpResponse;
                productPhotoResponse.responseProductPhoto = null;
                productPhotoResponse.photoAttachedProduct = false;
                observer.next(productPhotoResponse);
                observer.complete();
              });
              return observableCreateProduct;
            }
          })
        )
        .subscribe((productPhotoResponse: ProductPhotoResponse) => {
          this.spinnerService.hideSpinner();
          if (this.controlarMensajes(
            productPhotoResponse.responseProduct,
            'saveProduct')
          ) {
            this.productSaved.emit(true);
            this.clearForm();
            this.ngNotifyService.success(productPhotoResponse.responseProduct.message);
          }

          if (productPhotoResponse.photoAttachedProduct) {
            if (this.controlarMensajes(
              productPhotoResponse.responseProductPhoto,
              'saveProduct')
            ) {
              this.ngNotifyService.success(productPhotoResponse.responseProductPhoto.message);
            }
          }

        }, () => {
          this.spinnerService.hideSpinner();
        }));
  }

  public verifyValidators() {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  public resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.clearForm();
  }

  public clearForm() {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.textoTituloFormulario = 'Crear producto';
    this.productEditClear.emit(true);
    this.productEdit = null;
    this.resetCropAndPreview();
    this.reset();
  }


  onSelect($event: any) {
    this.imagenValida = false;
    this.imagenSrc = [];
    switch (typeof ($event)) {
      case 'string':
        this.imagenValida = true;
        this.imagenSrc = [$event];
        break;
      case 'object':
        this.imagenValida = true;
        this.imagenSrc = $event;
        break;
      default:
    }
    console.log(this.imagenSrc[0]);
  }

  reset() {
    this.imagenSrc = [];

  }
  getImage() {
    const base64 = this.imagenSrc[0].replace(/^data:image\/(png|jpg);base64,/, '');
    const imageBlob = this.dataURItoBlob(base64);
    const date = new Date().valueOf();
    const imageFile = new File([imageBlob], `producto${date}.jpg`, { type: 'image/jpeg' });
    return imageFile;
  }

  resetCropAndPreview() {
    this.fotoProducto.hasPreview = false;
    this.fotoProducto.mode = 'upload';
    if (this.imagenValida) {
      this.fotoProducto.reset();
      this.imagenValida = false;
    }
  }

}
