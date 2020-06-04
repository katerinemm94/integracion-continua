import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Provider } from '@shared/models/providers.model';
import { ResponseAPI } from '@shared/models/responseAPI.model';

@Injectable({
    providedIn: 'root'
})
export class ProviderService {

    private url = `${environment.url}providers`;

    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('Ocurrio un error:', error.error.message);
        } else {
            console.error(`Código de estado ${error.status}`);
            console.error(error.error);
        }
        return throwError(
            'Algo malo sucedió; por favor, inténtelo de nuevo más tarde.'
        );
    }

    getAllProviders(): Observable<{} | ResponseAPI<Provider[]>> {
        return this.httpClient.get<ResponseAPI<Provider[]>>(this.url)
            .pipe(catchError(this.handleError));
    }

    getProviderByCode(code: string): Observable<{} | ResponseAPI<Provider>> {
        return this.httpClient.get<ResponseAPI<Provider>>(`${this.url}/code/${code}`)
            .pipe(catchError(this.handleError));
    }

    createProvider(provider: Provider): Observable<{} | ResponseAPI<Provider>> {
        return this.httpClient.post<ResponseAPI<Provider>>(this.url, provider)
            .pipe(catchError(this.handleError));
    }

    updateProvider(provider: Provider): Observable<{} | ResponseAPI<Provider>> {
        return this.httpClient.put<ResponseAPI<Provider>>(`${this.url}/${provider.id}`, provider)
            .pipe(catchError(this.handleError));
    }

    updateProviderStatus(provider: Provider): Observable<{} | ResponseAPI<Provider>> {
        return this.httpClient.put<ResponseAPI<Provider>>(`${this.url}/status/${provider.id}`, provider)
            .pipe(catchError(this.handleError));
    }

    uploadProvider(formData: FormData, providerId: number): Observable<{} | ResponseAPI<any>> {
        return this.httpClient.post<ResponseAPI<any>>(`${this.url}/upload/${providerId}`, formData)
            .pipe(catchError(this.handleError));
    }

    getProviderPhoto(photo: string): Observable<Blob | ResponseAPI<Provider>> {

        const headersCustom = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json'
        });


        return this.httpClient.get<Blob | ResponseAPI<Provider>>(`${this.url}/photo/${photo}`,
            { headers: headersCustom, responseType: 'blob' as 'json' })
            .pipe(catchError(this.handleError));
    }

}
