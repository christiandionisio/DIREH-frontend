import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProveedoresComponent } from './proveedores.component';
import { CustomMaterialModule } from "../../core-angular-material/material.module";
import { ProveedorEditComponent } from '../proveedor-edit/proveedor-edit.component';

@NgModule({
  declarations: [
    ProveedoresComponent,
    ProveedorEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProveedoresRoutingModule,
    CustomMaterialModule
  ]
})
export class ProveedoresModule { }
