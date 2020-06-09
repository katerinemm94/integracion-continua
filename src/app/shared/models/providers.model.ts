import { ResponseAPI } from '@shared/models/responseAPI.model';
export class Provider {

    id?: number;

    code: string;

    name: string;

    city: string;

    country: string;

    whatsapp: string;

    telephone: string;

    notes: string;

    primaryPhotoURL: string;

    status: boolean;

    createdAt?: any;
    updatedAt?: any;

    constructor() {
        this.code = '';
        this.name = '';
        this.city = '';
        this.country = '';
        this.whatsapp = '';
        this.telephone = '';
        this.notes = null;
        this.primaryPhotoURL = null;
        this.status = true;
    }
}

export class ProviderPhoto {
    // Foto principal que toma desde el cel o sube desde la web
    // Las fotos de los modelos van en la tabla de galeria
    primaryPhotoURL: string;


    provider: Provider;

    /**
     *
     */
    constructor() {
        this.primaryPhotoURL = '';
        this.provider = null;
    }
}

export class ProviderPhotoResponse {

    responseProvider: ResponseAPI<Provider>;

    responseProviderPhoto: ResponseAPI<ProviderPhoto>;

    photoAttachedProvider: boolean;

    /**
     *
     */
    constructor() {
        this.responseProvider = new ResponseAPI<Provider>();
        this.responseProviderPhoto = new ResponseAPI<ProviderPhoto>();
        this.photoAttachedProvider = true;
    }

}
