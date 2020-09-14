import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagnosticoComponent } from './diagnostico.component';
// import { AuthGuard } from '../../services/auth.guard';
import { DiagnosticoAddComponent } from '../diagnostico-add/diagnostico-add.component';

const routes: Routes = [
  { path: '', component: DiagnosticoComponent},
  { path: ':dni', component: DiagnosticoAddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosticoRoutingModule { }
