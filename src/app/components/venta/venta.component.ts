import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { ClienteService } from '../../services/clientes.service';
import { VentaProductoService } from '../../services/venta_producto.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { MatPaginatorIntl } from '@angular/material'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { MatPaginatorIntlCro } from '../../utils/matPaginator.util'
import { DatosVenta } from '../../models/datosVenta.model';
import { EmpleadoModel } from '../../models/empleado.model';
import { ImagenModel } from '../../models/imagen.model';
import { PacienteModel } from '../../models/paciente.model';
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
// import * as jsPDF from 'jspdf';
// import 'jspdf-autotable';

var jsPDF = require('jspdf');
require('jspdf-autotable');
declare var $: any;

export interface PeriodicElement {
  producto: string;
  precio: string;
  cantidad: string;
  subtotal: string;
}


@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }, VentaProductoService, VentaService, ProductoService, ClienteService, DiagnosticoService, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },]

})

export class VentaComponent implements OnInit {
  tablaLlena;
  nuevoOrdenVentaForm: FormGroup;
  options: any[] = [];
  options2: any[] = [];
  options3: any[] = [];
  productos: any[] = [];
  cantidad: any[] = [];
  //auxproductos: any []= [];
  //lista: any[] = [];
  ordenventas: any[] = [];
  listarProductosVendidos: any[] = [];
  listprod: any[] = [];
  estado: boolean = false;
  stock: any = "";
  filteredOptions: Observable<PacienteModel[]>;
  filteredOptions2: Observable<EmpleadoModel[]>;
  filteredOptions3: Observable<ImagenModel[]>;
  numeroventa: any;
  ventaProducto: any;
  producto: any;
  //test :any;
  clientes: any;
  empleado: any;
  monto: number;
  monto1: any;
  valor: number;
  newArray: any[] = [];
  fecha = new Date();
  maxDate = new Date();
  @ViewChild('TABLE') table: ElementRef;

  ELEMENT_DATA: PeriodicElement[] = [];

  displayedColumns2: string[] = ['producto', 'precio', 'cantidad', 'subtotal'];
  dataSource2: MatTableDataSource<PeriodicElement>;

  constructor(
    private _ventaService: VentaService,
    private _productoService: ProductoService,
    private _empleadoService: DiagnosticoService,
    private _clienteService: ClienteService,
    private _ventaProductoService: VentaProductoService,
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA);
    this.tablaLlena = false;
    this.buildForm();
    this.listarOrdenVentas();
    this.listarVentaProductos();
    this.monto = 0;
    this.monto1 = 0;


    // PARA LLENAR EL ARRAY DE PROVEEDORES EN EL AUTOCOMPLETADO
    this._clienteService.listarClientes().subscribe(result => {
      this.options = result.clientes;
      this.filteredOptions = this.nuevoOrdenVentaForm.controls['cliente'].valueChanges
        .pipe(
          startWith<string | PacienteModel>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(name => name ? this._filter(name) : this.options.slice())
        );

    })

    // PARA LLENAR EL ARRAY DE SOLICITANTES EN EL AUTOCOMPLETADO
    // this._empleadoService.listarEmpleados().subscribe(result => {
    //   this.options2 = result.empleados;
    //   this.filteredOptions2 = this.nuevoOrdenVentaForm.controls['solicitante'].valueChanges
    //     .pipe(
    //       startWith<string | EmpleadoModel>(''),
    //       map(value => typeof value === 'string' ? value : ""),
    //       map(name => name ? this._filter2(name) : this.options2.slice())
    //     );
    // })

    // PARA LLENAR EL ARRAY DE PRODUCTOS EN EL AUTOCOMPLETADO
    
    this.llenarProductos();

    $('.mipanel').click(function(){
      setTimeout(function(){
        $('#cdk-overlay-0 .ng-trigger').attr("style", "max-width:420px");
        $('#cdk-overlay-1 .ng-trigger').attr("style", "max-width:420px");
        $('#cdk-overlay-2 .ng-trigger').attr("style", "max-width:420px");
        $('#cdk-overlay-3 .ng-trigger').attr("style", "max-width:420px");
        $('#cdk-overlay-4 .ng-trigger').attr("style", "max-width:420px");
        $('#cdk-overlay-5 .ng-trigger').attr("style", "max-width:420px");
        $('#cdk-overlay-6 .ng-trigger').attr("style", "max-width:420px");
      }, 0);
    })
  }

  displayFn(user?: PacienteModel): string | undefined {
    return user ? user.nombres + ' ' + user.apaterno : undefined;
  }

  displayFn2(user?: EmpleadoModel): string | undefined {
    return user ? user.nombres + ' ' + user.apellidos : undefined;
  }

  displayFn3(user?: ImagenModel): string | undefined {
    return user ? user.ojo : undefined;
  }

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }

  exportTable() {
    this.valor = 0;
    if ((<HTMLInputElement>document.getElementById("fechaInicio")).value == '' || (<HTMLInputElement>document.getElementById("fechaFin")).value == '') {
      Swal.fire({
        type: 'error',
        title: 'Fecha vacía',
        text: 'Complete los campos de Fecha Inicio y fecha Fin'
      })
      return;
    }
    else {
      let data = Object.values(this.dataSource);
      data = data[8];
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
          if (new Date(fechaBase) >= new Date(f1) && new Date(fechaBase) <= new Date(f2)){
            //this._ventaService.buscarVenta(data[i]._id).subscribe(
              //res => {
                //for (let k = 0; k < res.orden_venta.length; k++) {
                  //console.log(res.venta_producto[k].nombreProd);
                  this.newArray.push({
                    '# DE ORDEN VENTA': data[i]._id,
                    'FECHA DE VENTA': data[i].fecha,
                    'VENDEDOR': data[i].nombresEmp + ' ' + data[i].apellidosEmp,
                    'CLIENTE': data[i].nombres + ' ' + data[i].apellidos,
                    'EMAIL-CLIENTE': data[i].email,
                    'TELEFONO-CLIENTE': data[i].telefono,
                    'TOTAL': 'S/. ' + data[i].total.toFixed(2)
                  });
                //}
              //}
           // )
          }
          else{
            this.valor++;
          }
          if(i == data.length-1 && this.valor != data.length){
            //console.log(this.newArray);
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.newArray);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Book');
  
            /* save to file */
            XLSX.writeFile(wb, 'REPORTE_VENTAS.xlsx');
            this.newArray = [];
          }
        }
        if(this.valor == data.length){
          Swal.fire({
            type: 'info',
            title: 'No hay ventas para este período',
          })
        }
      }
    }
  }

  private _filter(name: string): PacienteModel[] {
    const filterValue = name.trim().toLowerCase();
    return this.options.filter(option => option.nombres.toLowerCase().indexOf(filterValue) != -1 ||
      option.apellidos.toLowerCase().indexOf(filterValue) != -1 ||
      option.dni.toLowerCase().indexOf(filterValue) != -1);
  }

  // private _filter2(name: string): EmpleadoModel[] {
  //   const filterValue = name.toLowerCase();
  //   return this.options2.filter(option2 => option2.nombres.toLowerCase().indexOf(filterValue) != -1 ||
  //     option2.apellidos.toLowerCase().indexOf(filterValue) != -1 ||
  //     option2.dni.toLowerCase().indexOf(filterValue) != -1);
  // }

  private _filter3(name: string): ImagenModel[] {
    const filterValue = name.trim().toLowerCase();
    return this.options3.filter(option3 => option3._id.toString().toLowerCase().indexOf(filterValue) != -1 ||
      option3.nombre.toLowerCase().indexOf(filterValue) != -1);
  }

  private buildForm() {
    return this.nuevoOrdenVentaForm = this.formBuilder.group({
      cliente: ['', [Validators.required]],
      solicitante: [JSON.parse(localStorage.getItem("empleado")).nombres + " " + JSON.parse(localStorage.getItem("empleado")).apellidos, [Validators.required]],
      producto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_vent: [new Date(), [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

  displayedColumns: string[] = ['numero_venta', 'cliente', 'solicitante', 'total', 'fecha_vent', 'acciones', 'acciones2'];
  dataSource: MatTableDataSource<DatosVenta>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  get cliente() { return this.nuevoOrdenVentaForm.value.cliente }

  listarOrdenVentas() {
    this._ventaService.listarOrdenVentas().subscribe(
      res => {
        this.ordenventas = res.ordenes_ventas;
        if (this.ordenventas.length == 0) {
          this.numeroventa = 1;
        }
        else {
          this.numeroventa = this.ordenventas[this.ordenventas.length - 1]._id + 1;
        }

        this.dataSource = new MatTableDataSource(res.ordenes_ventas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      })
  }

  listarVentaProductos() {
    this._ventaProductoService.listarVentaProductos().subscribe(
      res => {
        if(res.ventas_productos.length == 0){
          //console.log("Hola");
        }else{
        this.listarProductosVendidos = res.ventas_productos;
        }
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

  guardarOrdenVenta() {
    if (this.tablaLlena == false) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.nuevoOrdenVentaForm.controls)
        this.nuevoOrdenVentaForm.controls[i].markAsTouched();
      return;
    }
    else {
      this.nuevoOrdenVentaForm.controls['fecha_vent'].setValue(this.fecha.getDate() + "/" + (this.fecha.getMonth() + 1) + "/" + this.fecha.getFullYear());
      this.nuevoOrdenVentaForm.controls['total'].setValue(this.monto);
      this.nuevoOrdenVentaForm.controls['producto'].setValue(this.productos);
      this.nuevoOrdenVentaForm.controls['solicitante'].setValue(JSON.parse(localStorage.getItem("empleado"))._id);
      this.nuevoOrdenVentaForm.controls['cliente'].setValue(this.nuevoOrdenVentaForm.value.cliente._id);

      $('#vendedor').val("");
      $('#descripcion').val("");


      // for (let i = 0; i < this.productos.length; i++) {
      //   this._ventaProductoService.nuevoVentaProducto({ venta: this.numeroventa, producto: this.productos[i], cantidad: this.cantidad[i], estado: this.estado }).subscribe(
      //     res => {
      //     },
      //     err => { console.log(err); }
      //   )
      // }

      this._ventaService.nuevoOrdenVenta(this.nuevoOrdenVentaForm.value).subscribe(
        res => {
          Swal.fire({
            type: 'success',
            title: 'Orden de venta generada correctamente',
            text: 'Stock Actualizado',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          }).then(
            result => {
              for (let i = 0; i < this.productos.length; i++) {
                this.actualizarStock(i, this.cantidad[i]);
                this._ventaProductoService.nuevoVentaProducto({ venta: this.numeroventa, producto: this.productos[i], cantidad: this.cantidad[i], estado: this.estado }).subscribe(
                  res => {
                    this._productoService.listarProductos().subscribe(result => {
                      this.options3 = result.productos;
                    })
                  },
                  err => { console.log(err); }
                )
              }

              $('.fila').remove();
              $('#cantidad').val("");
              $('li').remove();
              $('ul hr').remove();
              this.ELEMENT_DATA = [];
              this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA);
              $('#modalNuevaOrdenVenta').modal('hide');
              this.listarOrdenVentas();
              this.listarVentaProductos();
              this.nuevoOrdenVentaForm.reset();
              this.productos = [];
              this.cantidad = [];
              this.monto = 0;
              this.monto1 = 0;
              this.stock = null;
              this.buildForm();
              this.llenarProductos();
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
    if (this.nuevoOrdenVentaForm.invalid || (<HTMLFormElement>document.querySelector("#cantidad")).value == "") {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.nuevoOrdenVentaForm.controls)
        this.nuevoOrdenVentaForm.controls[i].markAsTouched();
        $('#cantidad').val("");
      return;
    }



    else {

      // if(Number((<HTMLFormElement>document.querySelector("#cantidad")).value) <= 0 || !Number.isInteger(Number((<HTMLFormElement>document.querySelector("#cantidad")).value))){
      //   Swal.fire({
      //     type: 'error',
      //     title: 'Datos inválidos',
      //     text: 'Cantidad debe ser positivo y entero'
      //   })
      //   $('#cantidad').val("");
      //   //$('#cantidad').attr("autofocus","");
      //   return;
      // }

      var formcantidad = (<HTMLFormElement>document.querySelector("#cantidad")).value;
      var cantidad = Number(formcantidad);
      this.producto = this.nuevoOrdenVentaForm.value.producto;

      if (this.producto.stock < cantidad) {
        Swal.fire({
          type: 'error',
          title: 'Stock insuficiente',
          confirmButtonColor: '#3085d6',
          showConfirmButton: true,
        }).then(
          $('#cantidad').val(""),
          //$('#cantidad').attr('autofocus')
        )
      } else {
        this.stock = false;
        Swal.fire({
          type: 'success',
          title: 'Producto agregado',
          confirmButtonColor: '#3085d6',
          showConfirmButton: true,
        }).then((result) => {
          this.tablaLlena = true;
          this.productos.push(this.producto._id);
          this.cantidad.push(cantidad);

          var subtotal = this.producto.precio * cantidad;
          var subtotal1 = 'S/. ' + (this.producto.precio * cantidad).toFixed(2);
          this.monto = this.monto + subtotal;
          this.monto1 = this.monto.toFixed(2);

          for(var i=0 ; i<this.options3.length ; i++){
            if(this.options3[i]._id == this.producto._id){
              this.options3.splice(i, 1);
            }
          }

          // var table = document.querySelector("#tabla");
          // var tr = document.createElement("tr");
          // var td1 = document.createElement("td");
          // var td2 = document.createElement("td");
          // var td3 = document.createElement("td");
          // var td4 = document.createElement("td");

          // tr.setAttribute("class", "fila");

          // td1.append(this.producto.nombre);
          // td2.append(this.producto.descripcion);
          // td3.append(String(cantidad));
          // td4.append(String(subtotal1));

          // tr.appendChild(td1);
          // tr.appendChild(td2);
          // tr.appendChild(td3);
          // tr.appendChild(td4);
          // table.appendChild(tr);

          // var ul0 = document.getElementById("friendsList0");
          // var ul = document.getElementById("friendsList");
          // var ul2 = document.getElementById("friendsList2");
          // var ul3 = document.getElementById("friendsList3");

          // var li0 = document.createElement("li");
          // var li = document.createElement('li');
          // var li2 = document.createElement('li');
          // var li3 = document.createElement('li');

          // var hr0 = document.createElement('hr');
          // var hr = document.createElement('hr');
          // var hr2 = document.createElement('hr');
          // var hr3 = document.createElement('hr');

          // li.appendChild(document.createTextNode(this.producto.nombre));
          // li0.appendChild(document.createTextNode('S/. ' + this.producto.precio.toFixed(2)));
          // li2.appendChild(document.createTextNode(String(cantidad)));
          // li3.appendChild(document.createTextNode(String(subtotal1)));

          this.ELEMENT_DATA.push({producto:this.producto.nombre, precio:'S/. ' + this.producto.precio.toFixed(2), cantidad:String(cantidad), subtotal:String(subtotal1)});
          //console.log(this.ELEMENT_DATA);
          this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA);

          // li2.appendChild(boton);
          // li3.appendChild(document.createTextNode("Pendiente"));

          // ul0.appendChild(li0);
          // ul.appendChild(li);
          // ul2.appendChild(li2);
          // ul3.appendChild(li3);

          // ul0.appendChild(hr0)
          // ul.appendChild(hr);
          // ul2.appendChild(hr2);
          // ul3.appendChild(hr3);

          // li0.setAttribute("style","list-style: none");
          // li.setAttribute("style","list-style: none");
          // li2.setAttribute("style","list-style: none");
          // li3.setAttribute("style","list-style: none");

          $('#cantidad').val("");
          this.nuevoOrdenVentaForm.controls['producto'].setValue("");
        })
      }
    }
  }

  crearReporte(id) {
    id--;
    var id2 = id+1;
    var doc = new jsPDF('l', 'mm', 'a4');
    var prodaux;
    var pdfInMM = 210; ``
    var pageCenter = pdfInMM / 2;
    var pageright = 250;
    var pageleft = 30

    for (let i = 0; i < this.listarProductosVendidos.length; i++) {
      if (this.listarProductosVendidos[i].venta == id+1) {
        prodaux = this.listarProductosVendidos[i];
        this.listprod.push(prodaux);
      }
    }

    //TITULO
    doc.setFont('Times', 'bold');
    doc.setFontSize(25);
    doc.text('DISTRIBUIDORA ACERO LINO S.A.C.', pageCenter, 22, 'center');

    doc.setFont('Times', 'bold');
    doc.setFontSize(15);
    doc.text('OFRECE LA VENTA DE MATERIALES DE CONSTRUCCIÓN', pageCenter, 30, 'center');
    doc.text('ELÉCTRICOS, TUBOS, PVC-SANITARIOS EN GENERAL', pageCenter, 35, 'center');

    doc.setFont('Times');
    doc.setFontSize(10);
    doc.text('Email: ferreteria_lino@hotmail.com', pageCenter, 40, 'center');
    doc.text('AV. 1 MZ. A LT. 5 A.V. LA PLANICIE DE LA ERA - ATE - LIMA - LIMA', pageCenter, 47, 'center');
    doc.text('SUCURSAL: AV. ARÉVALO Nº 845 MURUHUAY - SANTA ROSA DE SACCO - YAULI - JUNIN', pageCenter, 52, 'center');
    doc.text('Telf: 7232591 RPM: #941969611 RPC: 980520888', pageCenter, 57, 'center');
    doc.text('__________________________________________________________________________________________', pageleft, 60, 'left')

    //DATOS cliente
    doc.setFont('Times', 'bold');
    doc.setFontSize(12);
    doc.text('Fecha: ' + this.ordenventas[id].fecha + '  ', pageleft, 67, 'left');
    doc.text('D.N.I:  ' + this.ordenventas[id].dni, 80, 67, 'left');
    doc.text('Señor(es): ' + this.ordenventas[id].nombres + ' ' + this.ordenventas[id].apellidos, pageleft, 72, 'left');
    doc.text('Direccion: ' + this.ordenventas[id].direccion, pageleft, 77, 'left');
    doc.text('__________________________________________________________________________________________________________________', pageleft, 81, 'left')

    //COLUMNA DEL RUC
    doc.autoTable({
      startY: 17,
      margin: { top: 0, right: 23, bottom: 0, left: 193 },
      headStyles: {
        fillColor: [130, 193, 221],
        textColor: [0, 0, 0],
        halign: 'center',
        fontSize: 22,
        font: 'Helvetica',
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      bodyStyles: {
        fillColor: [242, 245, 247],
        textColor: [0, 0, 0],
        halign: 'center',
        fontSize: 20,
        font: 'Helvetica',
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      head: [['R.U.C 20601473047 ']],
      body: [['Orden de Venta'], ['Nº ' + this.ordenventas[id]._id]]

    });

    //tabla producto
    doc.autoTable({
      startY: 84,
      headStyles: {
        fillColor: [130, 193, 221],
        textColor: [0, 0, 0],
        halign: 'center',
        fontSize: 13,
        font: 'Helvetica',
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      bodyStyles: {
        fillColor: [242, 245, 247],
        textColor: [0, 0, 0],
        halign: 'center',
        fontSize: 11,
        font: 'Helvetica',
        fontStyle: '',
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: this.headRows(),
      body: this.bodyRows(this.listprod.length)
    });

    doc.setFontSize(18);
    doc.text('TOTAL : S/. ' + this.ordenventas[id].total.toFixed(2), pageright, 185, 'center');

    // Save the PD
    doc.setFontSize(13);  
    doc.text('La venta fue realizada por: ' + this.ordenventas[id].nombresEmp + ' ' + this.ordenventas[id].apellidosEmp, pageleft, 198, 'left');
    doc.output('datauristring');        //returns the data uri string
    doc.output('dataurlnewwindow');     //opens the data uri in new window
    //doc.save('Orden de Venta ' + id2 + '.pdf');

    this.limpiar();
  }

  headRows() {
    return [{
      Cantidad: 'CANTIDAD',
      Descripcion: 'DESCRIPCION',
      Unitario: 'P. Unitario',
      Importe: 'IMPORTE'
    }];
  }

  bodyRows(rowCount) {
    let aux = [];
    for (let j = 0; j < rowCount; j++) {
      aux.push({
        Cantidad: this.listprod[j].cantidad,
        Descripcion: this.listprod[j].nombreProd + ' - ' + this.listprod[j].descripcion,
        Unitario: 'S/. ' + this.listprod[j].precio.toFixed(2),
        Importe: 'S/. ' + (this.listprod[j].cantidad * this.listprod[j].precio).toFixed(2),
      });
    }
    return aux;
  }

  exportarVentas() {
    this._ventaService.listarOrdenVentas().subscribe(
      res => {
        let data = res.ordenes_ventas;
        let newArray: any[] = [];
        for (let i = 0; i < data.length; i++) {
          newArray.push({
            '# DE ORDEN': data[i]._id,
            'FECHA DE VENTA': data[i].fecha,
            'VENDEDOR': data[i].nombresEmp + ' ' + data[i].apellidosEmp,
            'CLIENTE': data[i].nombres + ' ' + data[i].apellidos,
            'EMAIL-CLIENTE': data[i].email,
            'TELEFONO-CLIENTE': data[i].telefono,
            'TOTAL': 'S/. ' + data[i].total.toFixed(2)
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

  verStock() {
    if (this.nuevoOrdenVentaForm.value.producto)
      this.stock = this.nuevoOrdenVentaForm.value.producto.stock;
  }

  actualizarStock(i, cantidad){
    this._productoService.buscarProducto(this.productos[i]).subscribe(
      res => {
        var producto = res.producto[0];
        var nuevo_stock = producto.stock - cantidad;
        this._productoService.actualizarProducto(producto._id, { nombre: producto.nombre, descripcion: producto.descripcion, stock: nuevo_stock, precio: producto.precio }).subscribe(
          res => {
            
          }
        )
      }
    )
  }

  cerrar() {
    this.nuevoOrdenVentaForm.reset();
    this.productos = [];
    this.cantidad = [];
    this.monto = 0;
    this.monto1 = 0;
    this.stock = "";
    $('.fila').remove();
    $('#cantidad').val("");
    this.buildForm();
    $('li').remove();
    $('ul hr').remove();
    this.ELEMENT_DATA = [];
    this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA);
    this.llenarProductos();
  }

  limpiar() {
    this.listprod = [];
    this.listarProductosVendidos = [];
    this.ordenventas = [];
    this.listarOrdenVentas();
    this.listarVentaProductos();
  }

  llenarProductos(){
    this._productoService.listarProductos().subscribe(result => {
      this.options3 = result.productos;
      this.filteredOptions3 = this.nuevoOrdenVentaForm.controls['producto'].valueChanges
        .pipe(
          startWith<string | ImagenModel>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(name => name ? this._filter3(name) : this.options3.slice())
        );
    })
  }
}