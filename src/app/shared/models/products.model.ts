import { ResponseAPI } from '@shared/models/responseAPI.model';
export class Product {

    id?: number;

    code: string;

    description: string;

    // este es el valor en Yuanes
    // que es el de entrada del registro -> unitario
    unitPrice: number; // DECIMAL(10, 2)

    // cantidad de productos por cada caja
    quantityPerBox: number; // FLOAT

    // este es el valor en Yuanes
    // que es el de entrada del registro -> Caja
    boxPrice: number; // DECIMAL(10, 2)

    // Se crea constante para no quemar los valores
    // 0 Significa armado
    // 1 Significa desarmado
    packagingType: boolean;

    // cantidad de modelos que vienen en la caja
    numberModels: number; // INTEGER

    // Textarea que me permita dejar mensajes sobre el producto
    notes: string;

    // Foto ptincipal que toma desde el cel o sube desde la web
    // Las fotos de los modelos van en la tabla de galeria
    primaryPhotoURL: string;

    // Foto secundaria para mostrar en dispositivos móviles
    thumbnailPhotoUrl: string;

    status: boolean;

    createdAt?: any;
    updatedAt?: any;
    userId: number;

    constructor() {
        this.code = null;
        this.numberModels = 1;
        this.primaryPhotoURL = null;
        this.thumbnailPhotoUrl = null;
        this.status = true;
        this.userId = 1;
    }
}

export class ProductPhoto {
    // Foto ptincipal que toma desde el cel o sube desde la web
    // Las fotos de los modelos van en la tabla de galeria
    primaryPhotoURL: string;

    // Foto secundaria para mostrar en dispositivos móviles
    thumbnailPhotoUrl: string;

    product: Product;

    /**
     *
     */
    constructor() {
        this.primaryPhotoURL = '';
        this.thumbnailPhotoUrl = '';
        this.product = null;
    }
}

export class ProductPhotoResponse {

    responseProduct: ResponseAPI<Product>;

    responseProductPhoto: ResponseAPI<ProductPhoto>;

    photoAttachedProduct: boolean;

    /**
     *
     */
    constructor() {
        this.responseProduct = new ResponseAPI<Product>();
        this.responseProductPhoto = new ResponseAPI<ProductPhoto>();
        this.photoAttachedProduct = true;
    }

}
