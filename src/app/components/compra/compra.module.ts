import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraRoutingModule } from './compra-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from "../../core-angular-material/material.module";
import { CompraComponent } from './compra.component';
import { CompraDetailComponent } from '../compra-detail/compra-detail.component';

@NgModule({
  declarations: [
    CompraComponent,
    CompraDetailComponent
  ],
  imports: [
    CommonModule,
    CompraRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class CompraModule { }
