import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class ProductoService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    listarProductos(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/productos', { headers: headers });
    }

    nuevoProducto(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/producto', body, { headers: headers });
    }

    borrarProducto(productoId): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + '/producto/' + productoId, { headers: headers });
    }

    buscarProducto(productoId): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/producto/' + productoId, { headers: headers });
    }

    getProducto(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/producto/' + id, { headers: headers });
    }

    actualizarProducto(id, producto): Observable<any> {
        let params = JSON.stringify(producto)
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + '/producto/' + id, params, { headers: headers });
    }

}
