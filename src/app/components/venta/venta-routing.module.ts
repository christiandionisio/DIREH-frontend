import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentaComponent } from './venta.component';
import { AuthGuard } from '../../services/auth.guard';
import { VentaDetailComponent } from '../venta-detail/venta-detail.component';

const routes: Routes = [
  { path: '', component: VentaComponent, canActivate: [AuthGuard] },
  { path: ':id', component: VentaDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
