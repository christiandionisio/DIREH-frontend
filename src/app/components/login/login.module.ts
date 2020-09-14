import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoginRoutingModule } from './login-routing.module'
import { LoginComponent } from '../../components/login/login.component'
import { CustomMaterialModule } from "../../core-angular-material/material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    CustomMaterialModule
  ]
})
export class LoginModule { }
