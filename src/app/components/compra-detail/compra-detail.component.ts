import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompraService } from '../../services/compra.service';
import { ProductoService } from '../../services/producto.service';
import { CompraProductoService } from '../../services/compra_producto.service';
import { RemisionService } from '../../services/remision.service';
import Swal from 'sweetalert2'
declare var $: any;
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-compra-detail',
  templateUrl: './compra-detail.component.html',
  styleUrls: ['./compra-detail.component.css'],
  providers: [CompraService, ProductoService, CompraProductoService, RemisionService]
})


export class CompraDetailComponent implements OnInit {

  public idParam: string;
  public direccion: any;
  public ruc: any;
  public compraProducto: any;
  public productos: any[] = [];
  public remisionForm: FormGroup;
  public remision: any;
  public cantidad: any[] = [];
  public cantidadElementos: any;

  @ViewChild('content') content: ElementRef;

  motivos: any[] = [
    { value: 'Venta', viewValue: 'Venta' },
    { value: 'Compra', viewValue: 'Compra' },
    { value: 'Consignación', viewValue: 'Consignación' },
    { value: 'Venta con entrega a terceros', viewValue: 'Venta con entrega a terceros' },
    { value: 'Venta sujeta a confirmación por el comprador', viewValue: 'Venta sujeta a confirmación por el comprador' },
    { value: 'Traslado entre establecimientos', viewValue: 'Traslado entre establecimientos' },
    { value: 'Devolución', viewValue: 'Devolución' },
    { value: 'Recojo de bienes', viewValue: 'Recojo de bienes' },
    { value: 'Importación', viewValue: 'Importación' }
  ];


  constructor(
    private _compraService: CompraService,
    private _productoService: ProductoService,
    public _compraProductoService: CompraProductoService,
    public _remisionService: RemisionService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _router: Router
  ) {

  }

  ngOnInit() {
    this.listarCompraProducto();
    this.buildForm();
  }

  private buildForm() {
    return this.remisionForm = this.formBuilder.group({
      numero_remision: this.idParam,
      fechaIni: [new Date(), [Validators.required]],
      destinatario: ['Distribuidora Aceros Lino S.A.C', [Validators.required]],
      puntoPartida: [this.direccion, [Validators.required]],
      puntoLlegada: ['Mza. a Lote. 5 A.V. la Planicie de la Era', [Validators.required]],
      ruc: [this.ruc, [Validators.required]],
      motivo: ['', [Validators.required]],
      rucTrans: ['', [Validators.required]],
      denominacion: ['', [Validators.required]],
      marcaPlaca: ['', [Validators.required]],
      licencia: ['', [Validators.required]],
      cantidad: ['', [Validators.required]]
    });
  }

  private buildFormlleno(remision) {
    //console.log(remision.fechaInicio);
    var fecha = remision.fechaInicio.split("T")[0];
    //console.log(fecha);
    var parts = fecha.split("-");
    return this.remisionForm = this.formBuilder.group({
      numero_remision: this.idParam,
      fechaIni: [new Date(Number(parts[0]), Number(parts[1] - 1), Number(parts[2])), [Validators.required]],
      destinatario: ['Distribuidora Aceros Lino S.A.C', [Validators.required]],
      puntoPartida: [remision.partida, [Validators.required]],
      puntoLlegada: ['Mza. a Lote. 5 A.V. la Planicie de la Era', [Validators.required]],
      ruc: [remision.ruc, [Validators.required]],
      motivo: [remision.motivo, [Validators.required]],
      rucTrans: [remision.rucTrans, [Validators.required]],
      denominacion: [remision.denominacion, [Validators.required]],
      marcaPlaca: [remision.marcaPlaca, [Validators.required]],
      licencia: [remision.licencia, [Validators.required]],
      cantidad: ['', [Validators.required]]
    });
  }

  imprimir() {
    let doc = new jsPDF();
    // hoja A4 = 210 * 297
    doc.rect(110, 10, 90, 30); // Rectángulo para la Guía de Remisión
    doc.text('GUÍA DE REMISIÓN', 155, 20, 'center'); // Los dos ultimos son X,Y en la hoja A4
    doc.text('REMITENTE', 155, 26, 'center');
    doc.text('N° '+this.idParam, 155, 35, 'center');

    doc.text('FERRETERÍA LINO S.A.C.', 20, 25);
    doc.text('RUC N° 20601473047', 20, 31);

    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Fecha de Inicio de Traslado: ', 20, 50);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text((this.remisionForm.controls['fechaIni'].value).toLocaleString('es'), 84, 50);
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Destinatario: ', 20, 56);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text('Distribuidora Aceros Lino S.A.C', 51, 56);
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Punto de partida: ', 20, 62);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text(this.remisionForm.controls['puntoPartida'].value, 60, 62);
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Punto de llegada: ', 20, 68);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text(this.remisionForm.controls['puntoLlegada'].value, 61, 68);
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Motivo de traslado: ', 20, 74);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text(this.remisionForm.controls['motivo'].value, 64, 74);
    doc.line(20, 80, 190, 80);
    doc.setFontType("bold"); doc.setFontSize(13);
    doc.text('Datos del bien transportado ', 105, 90, 'center');
    doc.setFontSize(12);
    doc.text('Ítem', 70, 100, 'center');
    doc.text('Stock a', 105, 97, 'center');
    doc.text('añadir', 105, 103, 'center');
    doc.text('Estado', 140, 100, 'center');

    doc.setFontType("normal"); doc.setFontSize(11);

    let pivoteY = 106;
    for (let i = 0; i < this.cantidadElementos; i++) {
      pivoteY += 6;
      doc.text(this.compraProducto[i].nombreProd, 70, pivoteY, 'center');
      doc.text(this.compraProducto[i].cantidad.toString(), 105, pivoteY, 'center');
      if (this.compraProducto[i].estado == true)
        doc.text('Correcto', 140, pivoteY, 'center')
      else
        doc.text('Pendiente', 140, pivoteY, 'center')
    }

    pivoteY += 12;
    doc.line(20, pivoteY, 190, pivoteY);
    pivoteY += 12;

    doc.setFontType("bold"); doc.setFontSize(13);
    doc.text('Datos del transportista ', 105, pivoteY, 'center');
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('RUC: ', 20, pivoteY += 10);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text(this.remisionForm.controls['rucTrans'].value, 35, pivoteY);
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Denominación (Ap. y Nombres): ', 20, pivoteY += 6);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text(this.remisionForm.controls['denominacion'].value, 88, pivoteY);

    pivoteY += 12;
    doc.line(20, pivoteY, 190, pivoteY);
    pivoteY += 12;

    doc.setFontType("bold"); doc.setFontSize(13);
    doc.text('Datos de la unidad de transporte y conductor ', 105, pivoteY, 'center');
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Marca y placa: ', 20, pivoteY += 10);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text(this.remisionForm.controls['marcaPlaca'].value, 55, pivoteY);
    doc.setFontType("normal"); doc.setFontSize(13); doc.text('Licencia de conducir: ', 20, pivoteY += 6);
    doc.setFontType("italic"); doc.setFontSize(11); doc.text(this.remisionForm.controls['licencia'].value, 68, pivoteY);

    doc.save('Guía de Remisión.pdf');
  }

  listarCompraProducto() {
    this.idParam = this.route.snapshot.paramMap.get('id');
    this.direccion = this.route.snapshot.queryParamMap.get('direccion');
    this.ruc = this.route.snapshot.queryParamMap.get('ruc');


    this._remisionService.buscarRemision(this.idParam).subscribe(
      result => {
        if (result.remision[0] != null) {
          document.getElementById("guardar").setAttribute("disabled", "true");
          result.remision[0].cantidad = JSON.parse(result.remision[0].cantidad);
          this.buildFormlleno(result.remision[0]);
        }
        this._compraProductoService.buscarCompraProducto(this.idParam).subscribe(
          res => {
            this.compraProducto = res.compra_producto;
            console.log(this.compraProducto);
            this.cantidadElementos = this.compraProducto.length;
            localStorage.setItem("compraProducto", JSON.stringify(this.compraProducto));
            for (let i = 0; i < this.compraProducto.length; i++) {
              var producto = this.compraProducto[i].nombreProd;
              var cantidad = this.compraProducto[i].cantidad;

              var boton = document.createElement('button');
              var ul0 = document.getElementById("friendsList0");
              var ul = document.getElementById("friendsList");
              var ul2 = document.getElementById("friendsList2");
              var ul3 = document.getElementById("friendsList3");

              var li0 = document.createElement("li");
              var input = document.createElement("input");
              var li = document.createElement('li');
              var li2 = document.createElement('li');
              var li3 = document.createElement('li');

              var hr0 = document.createElement('hr');
              var hr = document.createElement('hr');
              var hr2 = document.createElement('hr');
              var hr3 = document.createElement('hr');

              li.appendChild(document.createTextNode(producto));
              li0.appendChild(input);
              if (result.remision[0] != null) {
                //console.log(result.remision[0]);
                input.appendChild(document.createTextNode(result.remision[0].cantidad[i]));
              } else {
                input.appendChild(document.createTextNode(cantidad));
              }

              li2.appendChild(boton);
              li3.appendChild(document.createTextNode("Pendiente"));

              ul0.appendChild(li0);
              ul.appendChild(li);
              ul2.appendChild(li2);
              ul3.appendChild(li3);

              ul0.appendChild(hr0)
              ul.appendChild(hr);
              ul2.appendChild(hr2);
              ul3.appendChild(hr3);

              var campo = document.querySelectorAll('#friendsList0 li input');
              campo[i].setAttribute("id", "campo0" + i);
              if (result.remision[0] != null) {
                campo[i].setAttribute("value", result.remision[0].cantidad[i]);
              } else {
                campo[i].setAttribute("value", cantidad);
              }
              document.getElementById("campo0" + i).style.listStyle = "none";
              document.getElementById("campo0" + i).style.textAlign = "center";
              document.getElementById("campo0" + i).style.width = "100%";
              document.getElementById("campo0" + i).style.margin = "-3px";

            }

            var list2 = document.querySelectorAll('#friendsList2 li');
            for (let i = 0; i < list2.length; i++) {
              list2[i].setAttribute("id", "list2" + i);
              document.getElementById("list2" + i).style.listStyle = "none";
              document.getElementById("list2" + i).style.textAlign = "center";
            }

            var list3 = document.querySelectorAll('#friendsList3 li');
            for (let i = 0; i < list3.length; i++) {
              list3[i].setAttribute("id", "list3" + i);
              document.getElementById("list3" + i).style.listStyle = "none";
              document.getElementById("list3" + i).style.textAlign = "center";
              document.getElementById("list3" + i).style.color = "green";
              document.getElementById("list3" + i).style.fontWeight = "bold";
            }

            var buton = document.querySelectorAll('#friendsList2 li button');
            for (let i = 0; i < buton.length; i++) {
              buton[i].appendChild(document.createTextNode("Verificar"));
              buton[i].setAttribute("class", "mat-raised-button mat-primary");
              buton[i].setAttribute("id", "boton" + i);
              document.getElementById("boton" + i).style.marginTop = "-10px";
              document.getElementById("boton" + i).style.marginBottom = "-10px";
              if (this.compraProducto[i].estado == 1) {
                document.getElementById("list3" + i).style.color = "blue";
                document.getElementById("list3" + i).innerHTML = "Correcto";
                document.getElementById("boton" + i).setAttribute("disabled", "disabled");
              }
              document.getElementById("boton" + i).addEventListener('click', function (event) {
                let id = this.id.split("boton")[1];
                localStorage.setItem("id", id);
              });
            }
          },
          error => {
            console.log(error);
          }
        )
      },
      error => {
        console.log(error);
      }
    )


  }

  actualizarEstado() {
    var id = Number(localStorage.getItem("id"));
    this.compraProducto = JSON.parse(localStorage.getItem('compraProducto'));
    for (let i = 0; i < this.compraProducto.length; i++) {
      if (i == id) {
        document.getElementById("list3" + i).innerHTML = "Correcto";
        document.getElementById("list3" + i).style.color = "blue";
        document.getElementById("list3" + i).style.fontWeight = "bold";
        document.getElementById("boton" + i).setAttribute("disabled", "disabled");

        this._compraProductoService.actualizarCompraProducto(this.compraProducto[i]._id, { compra: this.compraProducto[i].compra, producto: this.compraProducto[i].producto, cantidad: this.compraProducto[i].cantidad, estado: 1 }).subscribe(
          res => {
            Swal.fire({
              type: 'success',
              title: 'Pedido verificado!',
              //text: 'Stock Actualizado',
              confirmButtonColor: '#3085d6',
              showConfirmButton: true,
            })
          },
          error => {
            console.log(error);
          }
        )
      }
    }
  }

  guardarRemision() {
    for (let i = 0; i < this.compraProducto.length; i++) {
      this.cantidad.push(Number((<HTMLFormElement>document.getElementById("campo0" + i)).value));
      //console.log(this.cantidad);
      if ((<HTMLFormElement>document.getElementById("campo0" + i)).value == null) {
        Swal.fire({
          type: 'error',
          title: 'Datos inválidos',
          text: 'Revise nuevamente y llene correctamente los campos de stock.'
        })
        this.cantidad = [];
        return;
      }
    }
    this.remisionForm.controls['cantidad'].setValue(this.cantidad);
    if (this.remisionForm.invalid) {
      Swal.fire({
        type: 'error',
        title: 'Datos inválidos',
        text: 'Revise nuevamente y llene correctamente los campos.'
      })
      for (let i in this.remisionForm.controls)
        this.remisionForm.controls[i].markAsTouched();
      this.cantidad = [];
      return;
    } else {
      //console.log(this.remisionForm.value);
      this._remisionService.nuevoRemision(this.remisionForm.value).subscribe(
        res => {
          Swal.fire({
            type: 'success',
            title: 'Guía de remisión guardada correctamente',
            text: 'Stock de productos actualizados',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          }).then(
            result => {
              for (let i = 0; i < this.compraProducto.length; i++) {
                var input = Number((<HTMLFormElement>document.getElementById("campo0" + i)).value);

                var nuevo_stock = this.compraProducto[i].stock + input;

                this._productoService.actualizarProducto(this.compraProducto[i].idProd, { nombre: this.compraProducto[i].nombreProd, descripcion: this.compraProducto[i].descripcion, stock: nuevo_stock, precio: this.compraProducto[i].precio }).subscribe(
                  res => {
                    console.log('ok')
                  },
                  err => {
                    console.log(err);
                  }
                )
              }
              document.getElementById("guardar").setAttribute("disabled", "true");
              this.cantidad = [];
            }
          )
        },
        err => {
          console.log(err);
        }
      )
    }
  }

}
