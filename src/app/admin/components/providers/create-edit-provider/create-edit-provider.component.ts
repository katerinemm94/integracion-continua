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
import { Provider } from '@shared/models/providers.model';
import { ProviderService } from '@admin/components/providers/services/provider.service';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { Base } from '@shared/base/base';
import { Subscription, Observable, Subject, of, timer } from 'rxjs';
import { NgxImgComponent } from 'ngx-img';
import { TEXTO_CROPPER, OPCIONES_CROPPER_PROVEEDOR, ERRORES_CROPPER, GENERAL } from '@shared/constants/general.constants';
import { flatMap, map, tap, switchMap, startWith, filter, take } from 'rxjs/operators';
import { ProviderPhoto, ProviderPhotoResponse } from '@shared/models/providers.model';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-create-edit-provider',
  templateUrl: './create-edit-provider.component.html',
  styleUrls: ['./create-edit-provider.component.scss']
})
export class CreateEditProviderComponent extends Base implements OnInit, OnChanges, OnDestroy {

  public formSubmitSubject$: Subject<any>;

  public subscriptions: Subscription[] = [];

  @Input() providerEdit: Provider;
  @Output() providerSaved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() providerEditClear: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('fotoProveedor') fotoProveedor: NgxImgComponent;

  public generalMessages = GENERAL_MESSAGES_VALIDATIONS;
  public validateForm: FormGroup;
  public textoTituloFormulario: string;

  public imagenSrc: any = [];
  public imagenValida = false;

  public textoCropper = TEXTO_CROPPER;
  public opcionesCropper = OPCIONES_CROPPER_PROVEEDOR;
  public erroresCropper = ERRORES_CROPPER;

  constructor(
    private providerService: ProviderService,
    public ngNotifyService: NgNotifyService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder
  ) {
    super(ngNotifyService);
    this.validateForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(255)], this.validateCodeNotTaken.bind(this)],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      city: [null, [Validators.required, Validators.maxLength(10)]],
      country: [null, [Validators.required, Validators.maxLength(10)]],
      whatsapp: [null, [Validators.required, Validators.maxLength(10)]],
      telephone: [null, [Validators.required, Validators.maxLength(10)]],
      notes: ['', [Validators.maxLength(250)]]
    });
    this.textoTituloFormulario = 'Crear proveedor';
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const providerEdit: SimpleChange = changes.providerEdit;
      if (providerEdit.currentValue) {
        this.providerEdit = providerEdit.currentValue;
        this.setFormValuesEdit();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(suscription => {
      suscription.unsubscribe();
    });
  }

  private validateCodeNotTaken(control: AbstractControl) {

    if (!control.value) {
      return of(null);
    }

    if (this.providerEdit) {

      if (control.value.toUpperCase() === this.providerEdit.code.toUpperCase()) {
        return of(null);
      }

    }

    const code = control.value.toUpperCase();

    return timer(500).pipe(
      switchMap(() => {
        return this.providerService.getProviderByCode(code).pipe(
          map((response: ResponseAPI<Provider>) => {
            return response.response ? { codeTaken: true } : null;
          }));
      })
    );
  }

  public setFormValuesEdit() {
    if (this.providerEdit) {
      this.textoTituloFormulario = 'Editar proveedor';
      this.validateForm.get('code').setValue(this.providerEdit.code);
      this.validateForm.get('name').setValue(this.providerEdit.name);
      this.validateForm.get('city').setValue(this.providerEdit.city.toString());
      this.validateForm.get('country').setValue(this.providerEdit.country.toString());
      this.validateForm.get('whatsapp').setValue(this.providerEdit.whatsapp.toString());
      this.validateForm.get('telephone').setValue(this.providerEdit.telephone.toString());
      this.validateForm.get('notes').setValue(this.providerEdit.notes);
      this.verifyValidators();
    }
  }

  public submitForm(): void {
    if (this.validateForm.valid) {
      this.spinnerService.showSpinner();
      if (this.providerEdit) {
        this.updateProvider();
      } else {
        this.newProvider();
      }
    } else {
      this.submitFormErrors();
    }
  }


  private newProvider() {
    const provider: Provider = new Provider();
    provider.code = this.validateForm.get('code').value ? this.validateForm.get('code').value : null;
    provider.name = this.validateForm.get('name').value;
    provider.city = this.validateForm.get('city').value;
    provider.country = this.validateForm.get('country').value;
    provider.whatsapp = this.validateForm.get('whatsapp').value;
    provider.telephone = this.validateForm.get('telephone').value;
    provider.notes = this.validateForm.get('notes').value;
    this.saveProvider(provider, GENERAL.NEW);
  }

  private updateProvider() {
    const provider: Provider = this.providerEdit;
    provider.code = this.validateForm.get('code').value ? this.validateForm.get('code').value : null;
    provider.name = this.validateForm.get('name').value;
    provider.city = this.validateForm.get('city').value;
    provider.country = this.validateForm.get('country').value;
    provider.whatsapp = this.validateForm.get('whatsapp').value;
    provider.telephone = this.validateForm.get('telephone').value;
    provider.notes = this.validateForm.get('notes').value;
    this.saveProvider(provider, GENERAL.UPDATE);
  }

  /**
   * Método para guardar los proveedores en base de datos
   * @param provider provider proveedor que se guarda en base de datos
   * @param newOrUpdate parametro que indica si es un proveedor nuevo o se debe actualizar
   */
  private saveProvider(provider: Provider, newOrUpdate: string = GENERAL.NEW) {

    provider.code = provider.code ? provider.code.toUpperCase() : provider.code;

    this.subscriptions.push(
      (newOrUpdate === GENERAL.NEW ? this.providerService
        .createProvider(provider) : this.providerService
          .updateProvider(provider))
        .pipe(
          flatMap((httpResponse: ResponseAPI<Provider>) => {
            if (this.controlarRespuestas(httpResponse, 'saveProvider')) {
              if (this.imagenValida) {

                const formData = new FormData();
                formData.append('image', this.getImage());
                return this.providerService.uploadProvider(formData, httpResponse.data.id).pipe(
                  map((httpResponseUploadPhoto: ResponseAPI<ProviderPhoto>) => {
                    const providerPhotoResponse = new ProviderPhotoResponse();
                    providerPhotoResponse.responseProvider = httpResponse;
                    providerPhotoResponse.responseProviderPhoto = httpResponseUploadPhoto;
                    providerPhotoResponse.photoAttachedProvider = true;
                    return providerPhotoResponse;
                  })
                );

              } else {
                const observableCreateProvider = new Observable<ProviderPhotoResponse>((observer) => {
                  const providerPhotoResponse = new ProviderPhotoResponse();
                  providerPhotoResponse.responseProvider = httpResponse;
                  providerPhotoResponse.responseProviderPhoto = null;
                  providerPhotoResponse.photoAttachedProvider = false;
                  observer.next(providerPhotoResponse);
                  observer.complete();
                });
                return observableCreateProvider;
              }
            } else {
              const observableCreateProvider = new Observable<ProviderPhotoResponse>((observer) => {
                const providerPhotoResponse = new ProviderPhotoResponse();
                providerPhotoResponse.responseProvider = httpResponse;
                providerPhotoResponse.responseProviderPhoto = null;
                providerPhotoResponse.photoAttachedProvider = false;
                observer.next(providerPhotoResponse);
                observer.complete();
              });
              return observableCreateProvider;
            }
          })
        )
        .subscribe((providerPhotoResponse: ProviderPhotoResponse) => {

          this.spinnerService.hideSpinner();

          if (this.controlarMensajes(
            providerPhotoResponse.responseProvider,
            'saveProvider')
          ) {
            this.providerSaved.emit(true);
            this.clearForm();
            this.ngNotifyService.success(providerPhotoResponse.responseProvider.message);
          }

          if (providerPhotoResponse.photoAttachedProvider) {
            if (this.controlarMensajes(
              providerPhotoResponse.responseProviderPhoto,
              'saveProvider')
            ) {
              this.ngNotifyService.success(providerPhotoResponse.responseProviderPhoto.message);
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
    this.textoTituloFormulario = 'Crear proveedor';
    this.providerEditClear.emit(true);
    this.providerEdit = null;
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
    const imageFile = new File([imageBlob], `proveedor${date}.jpg`, { type: 'image/jpeg' });
    return imageFile;
  }

  resetCropAndPreview() {
    this.fotoProveedor.hasPreview = false;
    this.fotoProveedor.mode = 'upload';
    if (this.imagenValida) {
      this.fotoProveedor.reset();
      this.imagenValida = false;
    }
  }

}
