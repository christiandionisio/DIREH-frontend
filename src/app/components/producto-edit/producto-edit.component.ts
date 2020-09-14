import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-producto-edit',
  templateUrl: './producto-edit.component.html',
  styleUrls: ['./producto-edit.component.css'],
  providers: [ProductoService]
})

export class ProductoEditComponent implements OnInit {
  public idParam: string;
  editProductoForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _productoService: ProductoService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.idParam = this.route.snapshot.paramMap.get('id');
    this.buildForm()
    this._productoService.getProducto(this.idParam).subscribe(
      res => {
        let producto = res.producto[0];
        this.editProductoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          stock: producto.stock,
          precio: producto.precio
        })
      }
    )
  }

  private buildForm() {
    return this.editProductoForm = this.formBuilder.group({
      nombre: ['', [Validators.maxLength(60), Validators.required]],
      descripcion: ['', [Validators.maxLength(100), Validators.required]],
      stock: ['', [Validators.maxLength(15), Validators.required]],
      precio: ['', [Validators.maxLength(15), Validators.required, Validators.pattern(/^[0-9]\d*(\.\d{1,2})?$/)]]
    });
  }

  verValor() {
    if (this.editProductoForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.editProductoForm.controls)
        this.editProductoForm.controls[i].markAsTouched();
      return;
    }
    

    this._productoService.actualizarProducto(this.idParam, this.editProductoForm.value).subscribe(
      res => {
        Swal.fire({
          type: 'success',
          title: 'La operación fue exitosa!',
          text: 'Editado correctamente.'
        }).then((result) => {
          if (result.value) {
            this._router.navigateByUrl('/home/productos')
          }
        });
      },
      err => { console.log(err) }
    )
  }

}
