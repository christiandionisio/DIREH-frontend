import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../services/clientes.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.css'],
  providers: [ClienteService]
})

export class ClienteEditComponent implements OnInit {
  public idParam: string;
  editClienteForm: FormGroup;
  public cliente: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _clienteService: ClienteService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.idParam = this.route.snapshot.paramMap.get('id')
    this.buildForm()
    this._clienteService.buscarCliente(this.idParam).subscribe(
      res => {
        this.cliente = res.cliente[0];
        this.editClienteForm.patchValue({
          nombres: this.cliente.nombres,
          apellidos: this.cliente.apellidos,
          direccion: this.cliente.direccion,
          telefono: this.cliente.telefono,
          celular: this.cliente.celular,
          email: this.cliente.email,
          dni: this.cliente.dni
        })
      }
    )
  }

  private buildForm() {
    return this.editClienteForm = this.formBuilder.group({
      nombres: ['', [Validators.maxLength(60), Validators.minLength(3), Validators.required]],
      apellidos: ['', [Validators.maxLength(60), Validators.minLength(3), Validators.required]],
      direccion: ['', [Validators.maxLength(80), Validators.minLength(10), Validators.required]],
      telefono: ['', [Validators.maxLength(9), Validators.minLength(7), Validators.required, Validators.pattern('[0-9]+')]],
      celular: ['', [Validators.maxLength(9), Validators.minLength(9), Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.maxLength(60), Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/)]],
      dni: ['', [Validators.maxLength(8), Validators.minLength(8), Validators.required]]
    });
  }

  verValor() {
    if (this.editClienteForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene todos los campos correctamente.'
      })
      return;
    }

    this._clienteService.actualizarCliente(this.cliente._id, this.editClienteForm.value).subscribe(
      res => {
        Swal.fire({
          type: 'success',
          title: 'La operación fue exitosa!',
          text: 'Editado correctamente.'
        }).then((result) => {
          if (result.value) {
            this._router.navigateByUrl('/home/clientes')
          }
        });
      },
      err => { console.log(err) }
    )
  }


}