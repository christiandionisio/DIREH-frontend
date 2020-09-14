import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class ProveedorService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    listarProveedores(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/proveedores', { headers: headers });
    }

    nuevoProveedor(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/proveedor', body, { headers: headers });
    }

    borrarProveedor(proveedorId): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + '/proveedor/' + proveedorId, { headers: headers });
    }

    buscarProveedor(proveedorRuc): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/proveedor/' + proveedorRuc, { headers: headers });
    }

    actualizarProveedor(id, proveedor): Observable<any> {
        let params = JSON.stringify(proveedor)
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + '/proveedor/' + id, params, { headers: headers });
    }

}
