import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class VentaService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    listarOrdenVentas(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/orden_ventas', { headers: headers });
    }

    nuevoOrdenVenta(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/orden_venta', body, { headers: headers });
    }
    
    buscarVenta(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/orden_venta/' + id, { headers: headers });
    }
}
