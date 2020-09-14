import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../services/global';
import Swal from 'sweetalert2'
import { Subscription } from 'rxjs'
export let browserRefresh = false;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [LoginService, UploadService],
})
export class NavigationComponent implements OnInit {
  
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;

  compras: any;
  ventas: any;
  admin: any;
  result: any;
  oftalmologo: any;
  url: string;
  filesToUpload: Array<File>;
  subscription: Subscription;
  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _uploadService: UploadService
  ) {
    this.url = Global.url;
    if (window.localStorage.getItem('msgStartSession') == 'true') {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'success',
        title: 'Inicio de sesión correcto'
      })
    }
  }

  ngOnInit() {

    // this._loginService.verify().subscribe(
    //   res => this.result = res,
    //   err => {
    //     if (err instanceof HttpErrorResponse) {
    //       if (err.status == 401) {
    //         this._router.navigate(['/login']);
    //       }
    //     }
    //   }
    // );
    this.oftalmologo = JSON.parse(localStorage.getItem('oftalmologo'));
    window.localStorage.setItem('msgStartSession', 'false');
    //this.darAcceso();
  }

  // verificarAcceso() {
  //   let empleado = JSON.parse(window.localStorage.getItem("empleado"));
  //   console.log(empleado.role);
  // }

  // darAcceso() {
  //   if (this.empleado.role == 'ADMIN' || this.empleado.role == 'JEFE COMPRAS') {
  //     this.compras = true;
  //     this.ventas = false;
  //     this.admin = false;
  //   }
  //   else {
  //     if (this.empleado.role == 'JEFE COMPRAS') {
  //       this.compras = true;
  //       this.admin = false;
  //       this.ventas = false;
  //     }
  //     else {
  //       this.compras = false;
  //       this.admin = false;
  //       this.ventas = true;
  //       this._router.navigate(['home/diagnostico']);
  //     }

  //   }
  // }

  logout() {
    window.localStorage.removeItem("token");
    this._router.navigate(['']);
  }

  // fileChangeEvent(fileInput: any) {
  //   this.filesToUpload = <Array<File>>fileInput.target.files;
  //   if (this.filesToUpload) {
  //     this._uploadService.makeFileRequest(Global.url + "/upload-image/" + this.empleado._id, [], this.filesToUpload, 'img')
  //       .then((result: any) => {
  //         console.log(result);
  //         localStorage.setItem('empleado', JSON.stringify(result.resp[0]));
  //         this.empleado = JSON.parse(localStorage.getItem('empleado'));
  //       });
  //   }
  // }

}
