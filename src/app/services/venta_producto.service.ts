import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class VentaProductoService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }
p
    listarVentaProductos(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/venta_productos', { headers: headers });
    }

    nuevoVentaProducto(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/venta_producto', body, { headers: headers });
    }
    
    buscarVentaProducto(venta): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/venta_producto/' + venta, { headers: headers });
    }

    actualizarVentaProducto(id, ventaproducto): Observable<any> {
        let params = JSON.stringify(ventaproducto);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + '/venta_producto/' + id, params, { headers: headers });
    }

}