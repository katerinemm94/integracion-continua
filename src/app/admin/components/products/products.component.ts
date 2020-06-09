import { Component, OnInit, ViewChild, OnDestroy, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Product } from '@shared/models/products.model';
import { DataTableDirective } from 'angular-datatables';
import { SPANISH_DATATABLES } from '@shared/constants/general.constants';
import { Subject, Subscription } from 'rxjs';
import { Base } from '@shared/base/base';
import { ProductService } from './services/product.service';
import { NgNotifyService } from '@shared/services/ng-notify.service';
import { ResponseAPI } from '@shared/models/responseAPI.model';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends Base implements OnInit, OnDestroy {

  public subscriptions: Subscription[] = [];

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public dtOptions: any = {};
  private dtLanguage: any = SPANISH_DATATABLES;
  public dtTrigger: Subject<any> = new Subject();

  private childRow: ComponentRef<DetailProductComponent>;

  public products: Product[] = [];
  public productEdit: Product = null;

  constructor(
    private compFactory: ComponentFactoryResolver,
    private viewRef: ViewContainerRef,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    public ngNotifyService: NgNotifyService
  ) {
    super(ngNotifyService);
  }

  ngOnInit() {
    this.dtOptions = this.configDataTables();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(suscription => {
      suscription.unsubscribe();
    });
    this.dtTrigger.unsubscribe();
  }

  public loadProducts() {
    this.subscriptions.push(this.productService
      .getAllProducts()
      .subscribe((httpResponse: ResponseAPI<Product[]>) => {
        if (this.controlarMensajes(httpResponse, 'loadProducts')) {
          this.products = httpResponse.data;
          this.dtTrigger.next();
        }
      }));
  }

  private configDataTables(): any {
    return {
      columnDefs: [
        { targets: 0, style: 'imagen' },
      ],
      order: [[6, 'desc'], [1, 'asc']],
      columns: [
        { orderable: false, width: '10%', },
        { width: '15%' },
        { width: '15%' },
        { width: '15%' },
        { width: '15%' },
        { width: '15%' },
        { width: '15%' },
      ],
      pageLength: 10,
      language: this.dtLanguage,
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        {
          extend: 'colvis',
          text: 'Ocultar/Mostrar Columnas',
        },
        {
          extend: 'excel',
          text: 'Exportar a Excel',
          title: 'Listado de productos',
        },
        {
          extend: 'pdfHtml5',
          text: 'Exportar a pdf',
          title: 'Listado de productos',
          exportOptions: {
            stripHtml: true,
            columns: [0, 1, 2, 3, 4, 5, 6, 7]
          }
        }
      ]
    };
  }

  public expandRow(trRef, product: Product) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const row = dtInstance.row(trRef);
      if (row.child.isShown()) {
        row.child.hide();
      } else {
        const factory = this.compFactory.resolveComponentFactory(
          DetailProductComponent
        );
        this.childRow = this.viewRef.createComponent(factory);
        this.childRow.instance.product = product;
        this.childRow.instance.outputEvent.subscribe(val => console.log(val));
        row.child(this.childRow.location.nativeElement).show();
      }
    });
  }

  public loadEmitSaved() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.loadProducts();
    });
  }

  public productEditClear() {
    this.productEdit = null;
  }

  public setProductEdit(product: Product) {
    $('html, body').animate({
      scrollTop: 0
    });
    this.productEdit = product;
  }

  public trackByFn(index, item: Product) {
    return (!item) ? null : item.id; // or item.id
  }

  public changeStatus(product: Product) {

    const productStatusEdit = Object.assign({}, product);

    productStatusEdit.status = !productStatusEdit.status;

    this.spinnerService.showSpinner();

    this.subscriptions.push(this.productService
      .updateProductStatus(productStatusEdit)
      .subscribe((httpResponse: ResponseAPI<Product>) => {
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
