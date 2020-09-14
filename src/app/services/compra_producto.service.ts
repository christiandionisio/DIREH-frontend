import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class CompraProductoService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    listarCompraProductos(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/compra_productos', { headers: headers });
    }

    nuevoCompraProducto(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/compra_producto', body, { headers: headers });
    }
    
    buscarCompraProducto(compra): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/compra_producto/' + compra, { headers: headers });
    }

    actualizarCompraProducto(id, compraproducto): Observable<any> {
        let params = JSON.stringify(compraproducto);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + '/compra_producto/' + id, params, { headers: headers });
    }

}