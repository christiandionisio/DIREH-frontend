import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { MatPaginator, MatSort, MatTableDataSource, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { VentaProductoService } from '../../services/venta_producto.service'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [ProductoService, VentaProductoService, { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }, { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ReportesComponent implements OnInit {
  listaProductos: any;

  constructor(
    private _productoService: ProductoService,
    private _listaProductosVenta: VentaProductoService
  ) { }

  ngOnInit() {
  }

  verStock() {
    this._productoService.listarProductos().subscribe(
      res => {
        let data = res.productos;
        let newArray: any[] = [];
        for (let i = 0; i < data.length; i++) {
          newArray.push({
            'CODIGO DE PRODUCTO': data[i]._id,
            'NOMBRE': data[i].nombre,
            'DESCRIPCION': data[i].descripcion,
            'STOCK ACTUAL': data[i].stock,
            'PRECIO UNITARIO': data[i].precio
          })
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Book');

        /* save to file */
        XLSX.writeFile(wb, 'REPORTE_STOCK.xlsx');
      },
      err => {
        console.log(err);
      }
    )
  }

  exportarVentas() {
    this._listaProductosVenta.listarVentaProductos().subscribe(
      res => {
        let data = res.ventas_productos;
        let newArray: any[] = [];
        for (let i = 0; i < data.length; i++) {
          newArray.push({
            'ID DE VENTA': data[i].venta,
            'DNI CLIENTE': data[i].dni,
            'DESCRIPCION': data[i].descripcion,
            'NOMBRE-PRODUCTO': data[i].nombreProd,
            'PRECIO-UNITARIO-PRODUCTO': data[i].precio,
            'CANTIDAD ADQUIRIDA': data[i].cantidad,
            'SUBTOTAL': data[i].cantidad * data[i].precio
          })
          if(i == data.length - 1){
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Book');

            /* save to file */
            XLSX.writeFile(wb, 'REPORTE_VENTAS_GENERALES.xlsx');
          }
        }
      }
    )
  }

  exportarVentasPorFecha() {
    if ((<HTMLInputElement>document.getElementById("fechaInicio")).value == '' || (<HTMLInputElement>document.getElementById("fechaFin")).value == '') {
      Swal.fire({
        type: 'error',
        title: 'Fecha vacía',
        text: 'Complete los campos de Fecha Inicio y fecha Fin'
      })
      return;
    }
    else {
      this._listaProductosVenta.listarVentaProductos().subscribe(
        res => {
          let newArray: any[] = [];
          let data = res.ventas_productos;

          let fecha1 = (<HTMLInputElement>document.getElementById("fechaInicio")).value;
          let fecha2 = (<HTMLInputElement>document.getElementById("fechaFin")).value;

          let f1 = fecha1.split("/")[2] + "-" + fecha1.split("/")[1] + "-" + fecha1.split("/")[0];
          let f2 = fecha2.split("/")[2] + "-" + fecha2.split("/")[1] + "-" + fecha2.split("/")[0];

          if (new Date(f2) < new Date(f1)) {
            Swal.fire({
              type: 'error',
              title: 'Fechas Incorrectas',
              text: 'La fecha final es mayor a la fecha Inicial'
            })
            return;
          }
          else {
            for (let i = 0; i < data.length; i++) {
              let fechaBase = data[i].fecha.split("/")[2] + "-" + data[i].fecha.split("/")[1] + "-" + data[i].fecha.split("/")[0];
              if (new Date(fechaBase) >= new Date(f1) && new Date(fechaBase) <= new Date(f2))
                newArray.push({
                  'ID De VENTA': data[i].venta,
                  'DNI. CLIENTE': data[i].dni,
                  'DESCRIPCION': data[i].descripcion,
                  'NOMBRE-PRODUCTO': data[i].nombreProd,
                  'PRECIO-UNITARIO-PRODUCTO': data[i].precio,
                  'CANTIDAD ADQUIRIDA': data[i].cantidad,
                  'SUBTOTAL': data[i].cantidad * data[i].precio
                })
            }

            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Book');

            /* save to file */
            XLSX.writeFile(wb, 'REPORTE_VENTAS_FECHAS.xlsx');
          }
        }
      )
    }
  }

}
