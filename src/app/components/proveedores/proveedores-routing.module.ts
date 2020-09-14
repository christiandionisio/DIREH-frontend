import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';
import { AuthGuard } from '../../services/auth.guard';
import { ProveedorEditComponent } from '../proveedor-edit/proveedor-edit.component';

const routes: Routes = [
  { path: '', component: ProveedoresComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProveedorEditComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
