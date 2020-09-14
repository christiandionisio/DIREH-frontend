import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class RemisionService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    nuevoRemision(form): Observable<any> {
        let body = JSON.stringify(form);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/remision', body, { headers: headers });
    }
    
    buscarRemision(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/remision/' + id, { headers: headers });
    }

}