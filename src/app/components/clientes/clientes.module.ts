import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesRoutingModule } from './clientes-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesComponent } from './clientes.component';
import { CustomMaterialModule } from "../../core-angular-material/material.module";
import { ClienteEditComponent } from '../cliente-edit/cliente-edit.component';

@NgModule({
  declarations: [
    ClientesComponent,
    ClienteEditComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClientesRoutingModule,
    CustomMaterialModule
  ]
})
export class ClientesModule { }
