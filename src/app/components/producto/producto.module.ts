import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from "../../core-angular-material/material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from '../../components/producto/producto.component';
import { ProductoEditComponent } from '../producto-edit/producto-edit.component';

@NgModule({
  declarations: [
    ProductoComponent,
    ProductoEditComponent
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class ProductoModule { }
