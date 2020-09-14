import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class ClienteService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    listarClientes(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/clientes', { headers: headers });
    }

    nuevoCliente(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/cliente', body, { headers: headers });
    }

    borrarCliente(ClienteId): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + '/cliente/' + ClienteId, { headers: headers });
    }

    buscarCliente(ClienteRuc): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/cliente/' + ClienteRuc, { headers: headers });
    }

    actualizarCliente(id, Cliente): Observable<any> {
        let params = JSON.stringify(Cliente)
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + '/cliente/' + id, params, { headers: headers });
    }

}