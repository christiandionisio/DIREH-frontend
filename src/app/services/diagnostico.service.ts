import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class DiagnosticoService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url
    }

    listarDiagnosticos(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/historial', { headers: headers });
    }

    listarPacientes(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/paciente', { headers: headers });
    }

    listarImagenesPaciente(id_paciente): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/imagen/busquedaPorPaciente/'+id_paciente, { headers: headers });
    }

    realizarDiagnostico(formData): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
        return this._http.post('http://34.71.45.5:5000/model/direh/', formData, { headers: headers });
    }

    guardarDiagnostico(diagnostico): Observable<any> {
        let param = JSON.stringify(diagnostico);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/historial/registro', param, { headers: headers });
    }

    traerImagen(nombre_imagen): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'moverImagen/'+nombre_imagen);
    }

    nuevoEmpleado(empleado): Observable<any> {
        let param = JSON.stringify(empleado);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + '/empleado', param, { headers: headers });
    }

    editarEmpleado(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + '/empleado', { headers: headers });
    }

    buscarEmpleado(empleadoDni): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + '/empleado/' + empleadoDni, { headers: headers });
    }

    borrarEmpleado(idEmpleado): Observable<any> {
        console.log(idEmpleado);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + '/empleado/' + idEmpleado, { headers: headers });
    }

    actualizarEmpleado(id, empleado): Observable<any> {
        let params = JSON.stringify(empleado)
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + '/empleado/' + id, params, { headers: headers });
    }
}
