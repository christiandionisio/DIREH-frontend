import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material'
import { CompraService } from '../../services/compra.service'
import { ProductoService } from '../../services/producto.service'
import { DiagnosticoService } from '../../services/diagnostico.service'
import { ProveedorService } from '../../services/proveedores.service'
import { CompraProductoService } from '../../services/compra_producto.service'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { MatPaginatorIntl } from '@angular/material'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { MatPaginatorIntlCro } from '../../utils/matPaginator.util'
import { DatosCompra } from '../../models/datosCompra.model'
import { ProveedorModel } from '../../models/proveedor.model'
import { EmpleadoModel } from '../../models/empleado.model'
import { ImagenModel } from '../../models/imagen.model'
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-compras',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
  providers: [CompraProductoService, CompraService, ProductoService, ProveedorService, DiagnosticoService, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})

export class CompraComponent implements OnInit {
  tablaLlena;
  nuevoOrdenCompraForm: FormGroup;
  options: any[] = [];
  options2: any[] = [];
  options3: any[] = [];
  productos: any[] = [];
  cantidad: any[] = [];
  estado: boolean = false;
  stock: any = "";
  filteredOptions: Observable<ProveedorModel[]>;
  filteredOptions2: Observable<EmpleadoModel[]>;
  filteredOptions3: Observable<ImagenModel[]>;
  ordencompras: any[] = [];
  numerocompra: any;
  producto: any;
  proveedors: any;
  empleado: any;
  monto: number;
  fecha = new Date();

  constructor(
    private _compraService: CompraService,
    private _productoService: ProductoService,
    private _empleadoService: DiagnosticoService,
    private _proveedorService: ProveedorService,
    private _compraProductoService: CompraProductoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.tablaLlena = false;
    this.buildForm();
    this.listarOrdenCompras();
    this.monto = 0;

    // PARA LLENAR EL ARRAY DE PROVEEDORES EN EL AUTOCOMPLETADO
    this._proveedorService.listarProveedores().subscribe(result => {
      this.options = result.proveedores;
      this.filteredOptions = this.nuevoOrdenCompraForm.controls['proveedor'].valueChanges
        .pipe(
          startWith<string | ProveedorModel>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(name => name ? this._filter(name) : this.options.slice())
        );

    })

    // PARA LLENAR EL ARRAY DE SOLICITANTES EN EL AUTOCOMPLETADO
    this._empleadoService.listarDiagnosticos().subscribe(result => {
      this.options2 = result.empleados;
      this.filteredOptions2 = this.nuevoOrdenCompraForm.controls['solicitante'].valueChanges
        .pipe(
          startWith<string | EmpleadoModel>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(name => name ? this._filter2(name) : this.options2.slice())
        );
    })

    // PARA LLENAR EL ARRAY DE PRODUCTOS EN EL AUTOCOMPLETADO
    this._productoService.listarProductos().subscribe(result => {
      this.options3 = result.productos;
      this.filteredOptions3 = this.nuevoOrdenCompraForm.controls['producto'].valueChanges
        .pipe(
          startWith<string | ImagenModel>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(name => name ? this._filter3(name) : this.options3.slice())
        );
    })
  }

  displayFn(user?: ProveedorModel): string | undefined {
    return user ? user.nombre : undefined;
  }

  displayFn2(user?: EmpleadoModel): string | undefined {
    return user ? user.nombres + ' ' + user.apellidos : undefined;
  }

  displayFn3(user?: ImagenModel): string | undefined {
    return user ? user.ruta_imagen : undefined;
  }

  private _filter(name: string): ProveedorModel[] {
    const filterValue = name.trim().toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) != -1 ||
      option.ruc.toLowerCase().indexOf(filterValue) != -1);
  }

  private _filter2(name: string): EmpleadoModel[] {
    const filterValue = name.toLowerCase();
    return this.options2.filter(option2 => option2.nombres.toLowerCase().indexOf(filterValue) != -1 ||
      option2.apellidos.toLowerCase().indexOf(filterValue) != -1 ||
      option2.dni.toLowerCase().indexOf(filterValue) != -1);
  }

  private _filter3(name: string): ImagenModel[] {
    const filterValue = name.trim().toLowerCase();
    return this.options3.filter(option3 => option3._id.toString().toLowerCase().indexOf(filterValue) != -1 ||
      option3.nombre.toLowerCase().indexOf(filterValue) != -1);
  }

  private buildForm() {
    return this.nuevoOrdenCompraForm = this.formBuilder.group({
      proveedor: ['', [Validators.required]],
      solicitante: ['', [Validators.required]],
      producto: ['', [Validators.required]],
      descripcion: ['', [Validators]],
      fecha_comp: [new Date(), [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

  displayedColumns: string[] = ['numero_compra', 'proveedor', 'solicitante', 'total', 'fecha_comp', 'acciones'];
  dataSource: MatTableDataSource<DatosCompra>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  get proveedor() { return this.nuevoOrdenCompraForm.value.proveedor }

  listarOrdenCompras() {
    this._compraService.listarOrdenCompras().subscribe(
      res => {
        this.ordencompras = res.ordenes_compras;
        if (this.ordencompras.length == 0) {
          this.numerocompra = 1;
        }
        else {
          this.numerocompra = this.ordencompras[this.ordencompras.length - 1]._id + 1 ;
        }

        this.dataSource = new MatTableDataSource(res.ordenes_compras);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  guardarOrdenCompra() {
    if (this.tablaLlena == false) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.nuevoOrdenCompraForm.controls)
        this.nuevoOrdenCompraForm.controls[i].markAsTouched();
      return;
    }
    else {
      this.nuevoOrdenCompraForm.controls['fecha_comp'].setValue(this.fecha.getDate() + "/" + (this.fecha.getMonth() + 1) + "/" + this.fecha.getFullYear());
      this.nuevoOrdenCompraForm.controls['total'].setValue(this.monto);
      this.nuevoOrdenCompraForm.controls['producto'].setValue(this.productos);
      this.nuevoOrdenCompraForm.controls['solicitante'].setValue(this.nuevoOrdenCompraForm.value.solicitante._id);
      this.nuevoOrdenCompraForm.controls['proveedor'].setValue(this.nuevoOrdenCompraForm.value.proveedor._id);

      console.log(this.nuevoOrdenCompraForm.value);

      for (let i = 0; i < this.productos.length; i++) {
        this._compraProductoService.nuevoCompraProducto({ compra: this.numerocompra, producto: this.productos[i], cantidad: this.cantidad[i], estado: this.estado }).subscribe(
          res => {
          },
          err => { console.log(err); }
        )
      }

      this._compraService.nuevoOrdenCompra(this.nuevoOrdenCompraForm.value).subscribe(
        res => {
          Swal.fire({
            type: 'success',
            title: 'Orden de compra generada correctamente',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          }).then(

            result => {
              $('#modalNuevaOrdenCompra').modal('hide');
              this.listarOrdenCompras();
              this.nuevoOrdenCompraForm.reset();
              this.productos = [];
              this.cantidad = [];
              this.monto = 0;
              this.stock = null;
              $('.fila').remove();
              this.buildForm();
            }
          )
        },
        err => {
          console.log(err);
        }
      )
    }
  }

  mostrarProducto() {
    //console.log(this.fecha);
    //console.log(this.nuevoOrdenCompraForm.value);
    //this.nuevoOrdenCompraForm.value.fecha_comp = this.fecha;
    //this.monto = 0;
    if (this.nuevoOrdenCompraForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.nuevoOrdenCompraForm.controls)
        this.nuevoOrdenCompraForm.controls[i].markAsTouched();
      return;
    }
    else {
      this.stock = false;
      Swal.fire({
        type: 'success',
        title: 'Producto agregado',
        confirmButtonColor: '#3085d6',
        showConfirmButton: true,
      }).then((result) => {
        this.tablaLlena = true;
        var formcantidad = (<HTMLFormElement>document.querySelector("#cantidad")).value;
        var cantidad = Number(formcantidad);

        this.producto = this.nuevoOrdenCompraForm.value.producto;
        this.productos.push(this.producto._id);
        this.cantidad.push(cantidad);

        var subtotal = this.producto.precio * cantidad;
        this.monto = this.monto + subtotal;

        var table = document.querySelector("#tabla");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");

        tr.setAttribute("class", "fila");

        td1.append(this.producto.nombre);
        td2.append(this.producto.descripcion);
        td3.append(String(cantidad));
        td4.append(String(subtotal));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);

        $('#cantidad').val("");
        this.nuevoOrdenCompraForm.controls['producto'].setValue("");
      })
    }
  }

  verStock() {
    if (this.nuevoOrdenCompraForm.value.producto)
      this.stock = this.nuevoOrdenCompraForm.value.producto.stock;
  }

  cerrar() {
    this.nuevoOrdenCompraForm.reset();
    this.productos = [];
    this.cantidad = [];
    this.monto = 0;
    this.stock = "";
    $('.fila').remove();
    this.buildForm();
  }
}
