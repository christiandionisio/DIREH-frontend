import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from "../../core-angular-material/material.module";
import { DiagnosticoRoutingModule } from './diagnostico-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiagnosticoComponent } from './diagnostico.component';
import { DiagnosticoAddComponent } from '../diagnostico-add/diagnostico-add.component';

@NgModule({
  declarations: [
    DiagnosticoComponent,
    DiagnosticoAddComponent
  ],
  imports: [
    CommonModule,
    DiagnosticoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class DiagnosticoModule { }
