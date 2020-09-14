import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './components/error/error.component';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { BalancesComponent } from './components/balances/balances.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { VentaComponent } from './components/venta/venta.component';

import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginLayoutComponent,
    children: [
      { path: '', loadChildren: './components/login/login.module#LoginModule' }]
  },
  {
    path: 'home', component: HomeLayoutComponent, 
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: 'proveedores', loadChildren: './components/proveedores/proveedores.module#ProveedoresModule' },
      { path: 'diagnostico', loadChildren: './components/diagnostico/diagnostico.module#DiagnosticoModule' },
      { path: 'productos', loadChildren: './components/producto/producto.module#ProductoModule' },
      { path: 'clientes', loadChildren: './components/clientes/clientes.module#ClientesModule' },
      { path: 'compra', loadChildren: './components/compra/compra.module#CompraModule' },
      { path: 'venta', loadChildren: './components/venta/venta.module#VentaModule' },
      { path: 'remision', loadChildren: './components/remision/remision.module#RemisionModule' },
      { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard] },
      { path: 'balances', component: BalancesComponent, canActivate: [AuthGuard] }
      //{ path: 'venta', component: VentaComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: '**', component: ErrorComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

