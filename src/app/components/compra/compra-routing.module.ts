import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompraComponent } from './compra.component';
import { AuthGuard } from '../../services/auth.guard';
import { CompraDetailComponent } from '../compra-detail/compra-detail.component';

const routes: Routes = [
  { path: '', component: CompraComponent, canActivate: [AuthGuard] },
  { path: ':id', component: CompraDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraRoutingModule { }
