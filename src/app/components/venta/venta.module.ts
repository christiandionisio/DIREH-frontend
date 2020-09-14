import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaRoutingModule } from './venta-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../core-angular-material/material.module';
import { VentaComponent } from './venta.component';
import { VentaDetailComponent} from '../venta-detail/venta-detail.component';

@NgModule({
  declarations: [
    VentaComponent,
    VentaDetailComponent
  ],
  imports: [
    CommonModule,
    VentaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class VentaModule { }
