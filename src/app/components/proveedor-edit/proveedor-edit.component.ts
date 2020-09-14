import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProveedorService } from '../../services/proveedores.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-proveedor-edit',
  templateUrl: './proveedor-edit.component.html',
  styleUrls: ['./proveedor-edit.component.css'],
  providers: [ProveedorService]
})
export class ProveedorEditComponent implements OnInit {
  public idParam: string;
  editProveedorForm: FormGroup;
  public proveedor: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _proveedorService: ProveedorService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.idParam = this.route.snapshot.paramMap.get('id')
    this.buildForm()
    this._proveedorService.buscarProveedor(this.idParam).subscribe(
      res => {
        this.proveedor = res.proveedor[0];
        this.editProveedorForm.patchValue({
          nombre: this.proveedor.nombre,
          direccion: this.proveedor.direccion,
          telefono: this.proveedor.telefono,
          celular: this.proveedor.celular,
          email: this.proveedor.email,
          ruc: this.proveedor.ruc
        })
      }
    )
  }

  private buildForm() {
    return this.editProveedorForm = this.formBuilder.group({
      nombre: ['', [Validators.maxLength(60), Validators.minLength(8), Validators.required]],
      direccion: ['', [Validators.maxLength(80), Validators.minLength(10), Validators.required]],
      telefono: ['', [Validators.maxLength(9), Validators.minLength(7), Validators.required, Validators.pattern('[0-9]+')]],
      celular: ['', [Validators.maxLength(9), Validators.minLength(9)]],
      email: ['', [Validators.maxLength(60), Validators.required]],
      ruc: ['', [Validators.maxLength(11), Validators.required]]
    });
  }

  onSubmit() {
    if (this.editProveedorForm.valid)
      this._proveedorService.actualizarProveedor(this.proveedor._id, this.editProveedorForm.value).subscribe(
        res => {
          Swal.fire({
            type: 'success',
            title: 'La operación fue exitosa!',
            text: 'Editado correctamente.'
          }).then((result) => {
            if (result.value) {
              this._router.navigateByUrl('/home/proveedores')
            }
          });
        },
        err => { console.log(err) }
      )
    else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Coloque correctamente los datos'
      })
    }
  }


}
