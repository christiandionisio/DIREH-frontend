import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatPaginatorIntl } from '@angular/material';
import { ProductoService } from '../../services/producto.service'
import { MatPaginatorIntlCro } from '../../utils/matPaginator.util'
import { ImagenModel } from '../../models/imagen.model'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';

declare var $: any;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [ProductoService, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})

export class ProductoComponent implements OnInit {
  result: any;
  productos: any;
  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'stock', 'precio', 'acciones'];
  dataSource: MatTableDataSource<ImagenModel>;
  nuevoProductoForm: FormGroup

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _productoService: ProductoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.listarProductos();
    this.buildForm();
    // this._loginService.verify().subscribe(
    //   res => this.result = res,
    //   err => {
    //     if (err instanceof HttpErrorResponse) {
    //       if (err.status == 401) {
    //         this._router.navigate(['/login']);
    //       }
    //     }
    //   }
    // )
  }

  get formControls() { return this.nuevoProductoForm.controls }

  private buildForm() {
    return this.nuevoProductoForm = this.formBuilder.group({
      nombre: ['', [Validators.maxLength(60), Validators.required]],
      descripcion: ['', [Validators.maxLength(100), Validators.required]],
      stock: ['', [Validators.maxLength(15), Validators.required]],
      precio: ['', [Validators.maxLength(15), Validators.required,  Validators.pattern(/^[0-9]\d*(\.\d{1,2})?$/)]]
    });
  }

  onSubmit() {
    if (this.nuevoProductoForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.nuevoProductoForm.controls)
        this.nuevoProductoForm.controls[i].markAsTouched();
      return;
    }
    
    this._productoService.nuevoProducto(this.nuevoProductoForm.value).subscribe(
      res => {
        Swal.fire({
          type: 'success',
          title: 'El producto ha sido añadido exitosamente',
          confirmButtonColor: '#3085d6',
          showConfirmButton: true,
        }).then(
          result => {
            $('#modalNuevoProducto').modal('hide');
            this.listarProductos();
            this.nuevoProductoForm.reset();
          }
        )

      },
      err => {
        console.log(err);
      }
    )
  }

  listarProductos() {
    this._productoService.listarProductos().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res.productos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }

  borrarProducto(idEmpleado) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "El producto está apunto de ser eliminado!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      //console.log(result)
      if (result.value) {
        this._productoService.borrarProducto(idEmpleado).subscribe(
          result => {
            this.listarProductos();
            Swal.fire(
              'Eliminado!',
              'El producto ha sido borrado correctamente',
              'success'
            )
          },
          err => {
            console.log(err);
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Algo salió mal!'
            })
          }
        )
      }
    })
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
            'PRECIO UNITARIO': 'S/. ' + data[i].precio.toFixed(2)
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cerrar() {
    this.nuevoProductoForm.reset();
  }  

}

