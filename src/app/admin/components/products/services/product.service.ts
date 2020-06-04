import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Product } from '@shared/models/products.model';
import { ResponseAPI } from '@shared/models/responseAPI.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private url = `${environment.url}products`;

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

    getAllProducts(): Observable<{} | ResponseAPI<Product[]>> {
        return this.httpClient.get<ResponseAPI<Product[]>>(this.url)
            .pipe(catchError(this.handleError));
    }

    getProductByCode(code: string): Observable<{} | ResponseAPI<Product>> {
        return this.httpClient.get<ResponseAPI<Product>>(`${this.url}/code/${code}`)
            .pipe(catchError(this.handleError));
    }

    createProduct(product: Product): Observable<{} | ResponseAPI<Product>> {
        return this.httpClient.post<ResponseAPI<Product>>(this.url, product)
            .pipe(catchError(this.handleError));
    }

    updateProduct(product: Product): Observable<{} | ResponseAPI<Product>> {
        return this.httpClient.put<ResponseAPI<Product>>(`${this.url}/${product.id}`, product)
            .pipe(catchError(this.handleError));
    }

    updateProductStatus(product: Product): Observable<{} | ResponseAPI<Product>> {
        return this.httpClient.put<ResponseAPI<Product>>(`${this.url}/status/${product.id}`, product)
            .pipe(catchError(this.handleError));
    }

    uploadProduct(formData: FormData, productId: number): Observable<{} | ResponseAPI<any>> {
        return this.httpClient.post<ResponseAPI<any>>(`${this.url}/upload/${productId}`, formData)
            .pipe(catchError(this.handleError));
    }

    getProductPhoto(photo: string): Observable<Blob | ResponseAPI<Product>> {

        const headersCustom = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json'
        });


        return this.httpClient.get<Blob | ResponseAPI<Product>>(`${this.url}/photo/${photo}`,
            { headers: headersCustom, responseType: 'blob' as 'json' })
            .pipe(catchError(this.handleError));
    }

}
