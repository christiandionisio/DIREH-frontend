import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  mayusculas = false;
  hide = true;

  loginForm = this.fb.group({
    correo: ['',
      [
        Validators.maxLength(40),
        Validators.required,
        Validators.email
      ]
    ],
    password: ['',
      [
        Validators.maxLength(30),
        Validators.required,
        Validators.minLength(4)
      ]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private _loginService: LoginService,
    private _router: Router,
    private _auth: AuthService
  ) {
  }

  get correo() { return this.loginForm.get('correo'); }

  get password() { return this.loginForm.get('password'); }

  ngOnInit() {
    // if (localStorage.getItem('token'))
    //   this._loginService.verify().subscribe(
    //     res => {
    //       this._router.navigate(['/home']);
    //     },
    //     err => {
    //       if (err instanceof HttpErrorResponse) {
    //         if (err.status == 401) {
    //           this._router.navigate(['/login']);
    //         }
    //       }
    //     }
    //   )
  }

  getErrorMessage() {
    return this.password.hasError('required') ? 'La contraseña es obligatoria' :
      this.password.hasError('minlength') ? 'El mínimo de caracteres es: 4' :
        '';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.loginForm.controls)
        this.loginForm.controls[i].markAsTouched();
      return;
    }
    this._loginService.login(this.loginForm.value).subscribe(
      response => {
        console.log(response);
        var oftalmologo = JSON.stringify(response.resp);
        localStorage.setItem("oftalmologo",oftalmologo);
        this._router.navigate(['/home/diagnostico']);
      },
      error => {
        Swal.fire({
          type: 'error',
          title: 'Correo y/o contraseña incorrectas(s)',
          text: 'Ingrese correctamente los datos'
        })
      }
    )
  }

  detectaMayusculas(event) {
    if (event.getModifierState("CapsLock")) {
      this.mayusculas = true;
    } else {
      this.mayusculas = false;
    }
  }

}

