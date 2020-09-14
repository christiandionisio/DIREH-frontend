import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductoComponent } from '../../components/producto/producto.component';
import { AuthGuard } from '../../services/auth.guard';
import { ProductoEditComponent } from '../producto-edit/producto-edit.component';

const routes: Routes = [
  { path: '', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProductoEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
