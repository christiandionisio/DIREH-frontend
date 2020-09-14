import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class LoginService {
    public url: string;
    public empleado: any;

    constructor(private _http: HttpClient) {
        this.url = Global.url;
    }

    login(loginData): Observable<any> {
        let params = JSON.stringify(loginData);
        console.log(params);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/login', params, { headers: headers });
    }

    // verify(): Observable<any>{
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this._http.get(this.url + '/verify', { headers: headers });
    // }

    // logout(logoutData): Observable<any> {
    //     let params = JSON.stringify(logoutData);
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this._http.post(this.url + 'logout', params, { headers: headers });
    // }
    
}
