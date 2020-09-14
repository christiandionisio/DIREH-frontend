import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class CompraService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    listarOrdenCompras(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/orden_compras', { headers: headers });
    }

    nuevoOrdenCompra(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/orden_compra', body, { headers: headers });
    }
    
    buscarCompra(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/orden_compra/' + id, { headers: headers });
    }

}
