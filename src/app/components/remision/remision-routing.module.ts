import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemisionComponent } from './remision.component';
import { AuthGuard } from '../../services/auth.guard';
import { RemisionDetalleComponent } from '../remision-detalle/remision-detalle.component';

const routes: Routes = [
  { path: '', component: RemisionComponent, canActivate: [AuthGuard] },
  { path: 'detalle', component: RemisionDetalleComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemisionRoutingModule { }
