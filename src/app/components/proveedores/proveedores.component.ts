import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ProveedorService } from '../../services/proveedores.service';
import { MatPaginatorIntl } from '@angular/material';
declare var $: any;
import Swal from 'sweetalert2'
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatPaginatorIntlCro } from '../../utils/matPaginator.util'
import * as XLSX from 'xlsx';
export interface proveedoresData {
  _id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  celular: string;
  email: string;
}

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [ProveedorService, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})

export class ProveedoresComponent implements OnInit {
  empleados: any;
  displayedColumns: string[] = ['ruc', 'nombre', 'direccion', 'telefono', 'celular', 'email', 'acciones'];
  dataSource: MatTableDataSource<proveedoresData>;
  public nuevoProveedorForm: FormGroup;

  get formControls() { return this.nuevoProveedorForm.controls }

  private buildForm() {
    return this.nuevoProveedorForm = this.formBuilder.group({
      nombre: ['', [Validators.maxLength(60), Validators.minLength(8), Validators.required]],
      direccion: ['', [Validators.maxLength(80), Validators.minLength(10), Validators.required]],
      telefono: ['', [Validators.maxLength(9), Validators.minLength(7), Validators.required, Validators.pattern('[0-9]+')]],
      celular: ['', [Validators.maxLength(9), Validators.minLength(9)]],
      email: ['', [Validators.maxLength(60), Validators.required]],
      ruc: ['', [Validators.maxLength(11), Validators.required]]
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _proveedorService: ProveedorService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.listarProveedores();
    this.buildForm();
  }

  listarProveedores() {
    this._proveedorService.listarProveedores().subscribe(
      res => {
        console.log(res)
        this.dataSource = new MatTableDataSource(res.proveedores);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  exportarProveedores() {
    this._proveedorService.listarProveedores().subscribe(
      res => {
        let data = res.proveedores;
        let newArray: any[] = [];
        for (let i = 0; i < data.length; i++) {
          newArray.push({
            'RUC': data[i].ruc,
            'RAZON SOCIAL': data[i].nombre,
            'CORREO': data[i].email,
            'TELEFONO': data[i].telefono,
            'CELULAR': data[i].celular,
            'DIRECCION': data[i].direccion
          })
        }
        console.log(newArray);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Book');

        /* save to file */
        XLSX.writeFile(wb, 'REPORTE_PROVEEDORES.xlsx');
      }
    )
  }


  onSubmit() {
    if (this.nuevoProveedorForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.nuevoProveedorForm.controls)
        this.nuevoProveedorForm.controls[i].markAsTouched();
      return;
    }
    this._proveedorService.nuevoProveedor(this.nuevoProveedorForm.value).subscribe(
      res => {
        Swal.fire({
          type: 'success',
          title: 'El proveedor ha sido añadido',
          confirmButtonColor: '#3085d6',
          showConfirmButton: true,
        }).then(
          result => {
            $('#modalNuevoProveedor').modal('hide');
            this.listarProveedores();
            this.nuevoProveedorForm.reset();
          }
        )
      },
      err => {
        console.log(err);
      }
    )
  }

  borrarProveedor(proveedor) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El cambio no se podrá revertir!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        this._proveedorService.borrarProveedor(proveedor).subscribe(
          result => {
            this.listarProveedores();
            Swal.fire(
              'Borrado!',
              'El proveedor ha sido borrado correctamente',
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

}
