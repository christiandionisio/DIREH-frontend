import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { AuthGuard } from '../../services/auth.guard';
import { ClienteEditComponent } from '../cliente-edit/cliente-edit.component';

const routes: Routes = [
  {path: '', component: ClientesComponent, canActivate: [AuthGuard] },
  {path: ':id', component: ClienteEditComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
