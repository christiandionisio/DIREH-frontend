import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClienteService } from '../../services/clientes.service';
import { MatPaginatorIntl } from '@angular/material';
import Swal from 'sweetalert2'
import { Global } from '../../services/global';
import { MatPaginatorIntlCro } from '../../utils/matPaginator.util'
import { PacienteModel } from '../../models/paciente.model';
import { UploadService } from '../../services/upload.service';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClienteService, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})

export class ClientesComponent implements OnInit {
  empleados: any;
  displayedColumns: string[] = ['dni', 'nombres', 'apellidos', 'direccion', 'telefono', 'celular', 'email', 'acciones'];
  dataSource: MatTableDataSource<PacienteModel>;
  public nuevoClienteForm: FormGroup;
  filesToUpload: Array<File>;

  get nombres() { return this.nuevoClienteForm.get('nombres'); }
  get apellidos() { return this.nuevoClienteForm.get('apellidos'); }
  get direccion() { return this.nuevoClienteForm.get('direccion'); }
  get telefono() { return this.nuevoClienteForm.get('telefono'); }
  get celular() { return this.nuevoClienteForm.get('celular'); }
  get email() { return this.nuevoClienteForm.get('email'); }
  get dni() { return this.nuevoClienteForm.get('dni'); }

  private buildForm() {
    return this.nuevoClienteForm = this.formBuilder.group({
      nombres: ['', [Validators.maxLength(60), Validators.minLength(3), Validators.required]],
      apellidos: ['', [Validators.maxLength(60), Validators.minLength(3), Validators.required]],
      direccion: ['', [Validators.maxLength(80), Validators.minLength(10), Validators.required]],
      telefono: ['', [Validators.maxLength(9), Validators.minLength(7), Validators.required, Validators.pattern('[0-9]+')]],
      celular: ['', [Validators.maxLength(9), Validators.minLength(9), Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.maxLength(60), Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/)]],
      dni: ['', [Validators.maxLength(8), Validators.minLength(8), Validators.required]]
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private _uploadService: UploadService
  ) { }

  ngOnInit() {
    this.listarClientes();
    this.buildForm();
  }

  listarClientes() {
    this._clienteService.listarClientes().subscribe(
      res => {
        //console.log(res)
        this.dataSource = new MatTableDataSource(res.clientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }

  onSubmit() {
    if (this.nuevoClienteForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene todos los campos correctamente.'
      })
      return;
    }

    this._clienteService.nuevoCliente(this.nuevoClienteForm.value).subscribe(
      res => {
        Swal.fire({
          type: 'success',
          title: 'El cliente ha sido añadido',
          confirmButtonColor: '#3085d6',
          showConfirmButton: true,
        }).then(
          result => {
            $('#modalNuevoCliente').modal('hide');
            this.listarClientes();
            this.nuevoClienteForm.reset();
          }
        )
      },
      err => {
        console.log(err);
      }
    )
  }

  exportarClientes() {
    this._clienteService.listarClientes().subscribe(
      res => {
        let data = res.clientes;
        let newArray: any[] = [];
        for (let i = 0; i < data.length; i++) {
          newArray.push({
            'DNI': data[i].dni,
            'NOMBRES': data[i].nombres,
            'APELLIDOS': data[i].apellidos,
            'DIRECCIÓN': data[i].direccion,
            'TELÉFONO': data[i].telefono,
            'CELULAR': data[i].celular,
            'CORREO': data[i].email,
          })
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Book');
        /* save to file */
        // ws["!type"].
        XLSX.writeFile(wb, 'REPORTE_CLIENTES.xlsx');
      }
    )
  }
  
  // guardarCliente() {
  //   if (this.nuevoClienteForm.invalid) {
  //     Swal.fire({
  //       type: 'error',
  //       title: 'Datos inválidos',
  //       text: 'Revise nuevamente y llene correctamente los campos.'
  //     })
  //     return;
  //   }
  //   this._clienteService.nuevoCliente(this.nuevoClienteForm.value).subscribe(
  //     res => {
  //       this._uploadService.makeFileRequest(Global.url + "/upload-image/" + res.cliente._id, [], this.filesToUpload, 'img')
  //         .then((result: any) => {
  //           console.log(result);
  //         })
  //       Swal.fire({
  //         type: 'success',
  //         title: 'El cliente ha sido añadido',
  //         confirmButtonColor: '#3085d6',
  //         showConfirmButton: true,
  //       }).then(
  //         result => {
  //           $('#modalNuevoCliente').modal('hide');
  //           this.listarClientes();
  //           this.nuevoClienteForm.reset();
  //         }
  //       )
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   )
  // }

  borrarCliente(cliente) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El cambio no se podrá revertir!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this._clienteService.borrarCliente(cliente).subscribe(
          result => {
            this.listarClientes();
            Swal.fire(
              'Borrado!',
              'El cliente ha sido borrado correctamente',
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFileChange(event) {
    this.filesToUpload = <Array<File>>event.target.files;
  }

  cerrar() {
    this.nuevoClienteForm.reset();
  }
}
