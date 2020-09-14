import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../core-angular-material/material.module';
import { RemisionRoutingModule } from './remision-routing.module';
import { RemisionComponent } from './remision.component';
import { RemisionDetalleComponent } from '../remision-detalle/remision-detalle.component';

@NgModule({
  declarations: [
    RemisionComponent,
    RemisionDetalleComponent
  ],
  imports: [
    CommonModule,
    RemisionRoutingModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RemisionModule { }
