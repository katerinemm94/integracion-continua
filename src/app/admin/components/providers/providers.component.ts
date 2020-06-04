import { Component, OnInit, ViewChild, OnDestroy, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Provider } from '@shared/models/providers.model';
import { DataTableDirective } from 'angular-datatables';
import { SPANISH_DATATABLES } from '@shared/constants/general.constants';
import { Subject, Subscription } from 'rxjs';
import { Base } from '@shared/base/base';
import { ProviderService } from './services/provider.service';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { ResponseAPI } from '@shared/models/responseAPI.model';
import { DetailProviderComponent } from './detail-provider/detail-provider.component';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent extends Base implements OnInit, OnDestroy {

  public subscriptions: Subscription[] = [];

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public dtOptions: any = {};
  private dtLanguage: any = SPANISH_DATATABLES;
  public dtTrigger: Subject<any> = new Subject();

  private childRow: ComponentRef<DetailProviderComponent>;

  public providers: Provider[];
  public providerEdit: Provider;

  constructor(
    private compFactory: ComponentFactoryResolver,
    private viewRef: ViewContainerRef,
    private providerService: ProviderService,
    private spinnerService: SpinnerService,
    public ngNotifyService: NgNotifyService
  ) {
    super(ngNotifyService);
    this.providers = [];
    this.providerEdit = null;
  }

  ngOnInit() {
    this.dtOptions = this.configDataTables();
    this.loadProviders();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( suscription => {
      suscription.unsubscribe();
    });
    this.dtTrigger.unsubscribe();
  }

  public loadProviders() {
    this.subscriptions.push(this.providerService
      .getAllProviders()
      .subscribe((httpResponse: ResponseAPI<Provider[]>) => {
        if (this.controlarMensajes(httpResponse, 'loadProviders')) {
          this.providers = httpResponse.data;
          this.dtTrigger.next();
        }
      }));
  }

  private configDataTables(): any {
    return {
      order: [[7, 'desc'], [1, 'asc']],
      columns: [
        { orderable: false, width: '15%' },
        { width: '15%' },
        { width: '20%' },
        { width: '10%' },
        { width: '10%' },
        { width: '10%' },
        { width: '10%' },
        { width: '10%' }
      ],
      pageLength: 10,
      language: this.dtLanguage,
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        { extend: 'colvis', text: 'Ocultar/Mostrar Columnas' },
        {
          extend: 'excel',
          text: 'Exportar a Excel',
          title: 'Listado de proveedores'
        },
        {
          extend: 'pdfHtml5',
          text: 'Exportar a pdf',
          title: 'Listado de proveedores',
          customize: doc => {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < doc.content[1].table.body.length; i++) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < doc.content[1].table.body[i].length; j++) {
                let text = doc.content[1].table.body[i][j].text;
                text = text.replace(
                  /<!--bindings={   "ng-reflect-ng-if": "false" }-->/g,
                  ''
                );
                doc.content[1].table.body[i][j].text = text;
              }
            }

            // ensure doc.images exists
            doc.images = doc.images || {};

            // build dictionary
            doc.images.myGlyph =
              // tslint:disable-next-line:max-line-length
              'data:image/png;base64,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';
            // ..add more images[xyz]=anotherDataUrl here

            // when the content is <img src="myglyph.png">
            // remove the text node and insert an image node
            for (let i = 1; i < doc.content[1].table.body.length; i++) {
              if (
                doc.content[1].table.body[i][0].text ===
                '<img src="myglyph.png">'
              ) {
                delete doc.content[1].table.body[i][0].text;
                doc.content[1].table.body[i][0].image = 'myGlyph';
              }
            }
          },
          exportOptions: {
            stripHtml: true,
            columns: [0, 1, 2, 3, 4, 5, 6, 7]
          }
        }
      ]
    };
  }

  public expandRow(trRef, provider: Provider) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const row = dtInstance.row(trRef);
      if (row.child.isShown()) {
        row.child.hide();
      } else {
        const factory = this.compFactory.resolveComponentFactory(
          DetailProviderComponent
        );
        this.childRow = this.viewRef.createComponent(factory);
        this.childRow.instance.provider = provider;
        this.childRow.instance.outputEvent.subscribe(val => console.log(val));
        row.child(this.childRow.location.nativeElement).show();
      }
    });
  }

  public loadEmitSaved() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.loadProviders();
    });
  }

  public providerEditClear() {
    this.providerEdit = null;
  }

  public setProviderEdit(provider: Provider) {
    $('html, body').animate({
      scrollTop: 0
    });
    this.providerEdit = provider;
  }

  public trackByFn(index, item: Provider) {
    return (!item) ? null : item.id; // or item.id
  }

  public changeStatus(provider: Provider) {

    const providerStatusEdit = Object.assign({}, provider);

    providerStatusEdit.status = !providerStatusEdit.status;

    this.spinnerService.showSpinner();

    this.subscriptions.push(this.providerService
      .updateProviderStatus(providerStatusEdit)
      .subscribe((httpResponse: ResponseAPI<Provider>) => {
        this.spinnerService.hideSpinner();
        if (this.controlarMensajes(httpResponse, 'changeStatus')) {
          this.loadEmitSaved();
          this.ngNotifyService.success(httpResponse.message);
        }
      }, () => {
        this.spinnerService.hideSpinner();
      }));

  }

}
