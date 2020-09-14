import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MAT_DATE_LOCALE } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { VentaProductoService } from '../../services/venta_producto.service';
import Swal from 'sweetalert2';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { Button, $ } from 'protractor';

export interface PeriodicElement {
  producto: string;
  precio: string;
  cantidad: string;
  subtotal: string;
}




@Component({
  selector: 'app-venta-detail',
  templateUrl: './venta-detail.component.html',
  styleUrls: ['./venta-detail.component.css'],
  providers: [VentaService, ProductoService, VentaProductoService]
})
export class VentaDetailComponent implements OnInit {

  public idParam: string;
  public ventaProducto: any;
  public productos: any[] = [];
  monto: any;
  monto1: any;
  public fecha: any;
  public socket_recibe;

  ELEMENT_DATA: PeriodicElement[] = [];

  displayedColumns2: string[] = ['producto', 'cantidad', 'precio', 'subtotal'];
  dataSource2: MatTableDataSource<PeriodicElement>;

  constructor(
    private __ventaService: VentaService,
    private _productoService: ProductoService,
    public _ventaProductoService: VentaProductoService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _router: Router,
    private socket: Socket
  ) { }

  ngOnInit() {
    this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA);
    this.listarVentaProducto();
    this.monto = 0;
    this.socket_recibe = io('http://localhost:3001');
    this.socket_recibe.on('MENSAJE_DECLARACION', (data) => {
      Swal.fire(
              'Declarado!',
              'El comprobante ha sido declarado correctamente en la SUNAT',
              'success'
            )
    });
  }

  declararVenta() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El cambio no se podrá revertir!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, declarar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        var json = Object.assign({}, this.productos);
        console.log(json);
        this.socket.emit('ENVIAR_DECLARACION', JSON.stringify(json));
        // this._clienteService.borrarCliente(cliente).subscribe(
        //   result => {
        //     this.listarClientes();
        //     Swal.fire(
        //       'Borrado!',
        //       'El cliente ha sido borrado correctamente',
        //       'success'
        //     )
        //   },
        //   err => {
        //     console.log(err);
        //     Swal.fire({
        //       type: 'error',
        //       title: 'Oops...',
        //       text: 'Algo salió mal!'
        //     })
        //   }
        // )
      }
    })
  }

  listarVentaProducto() {
    this.idParam = this.route.snapshot.paramMap.get('id');
    this.__ventaService.buscarVenta(this.idParam).subscribe(
      response => {
        this.fecha = response.orden_venta[0].fecha;
      },
      error => {
        console.log(error);
      }
    );
    this._ventaProductoService.buscarVentaProducto(this.idParam).subscribe(
      res => {
        this.ventaProducto = res.venta_producto;
        localStorage.setItem("ventaProducto", JSON.stringify(this.ventaProducto));
        for (let i = 0; i < this.ventaProducto.length; i++) {
          var producto = this.ventaProducto[i].nombreProd;
          var cantidad = this.ventaProducto[i].cantidad;
          var precio = this.ventaProducto[i].precio.toFixed(2);
          var importe = (this.ventaProducto[i].precio * this.ventaProducto[i].cantidad).toFixed(2);
          this.monto = this.monto + (this.ventaProducto[i].precio * this.ventaProducto[i].cantidad);
          this.monto1 = this.monto.toFixed(2); 
          var item = {producto:producto, cantidad: cantidad, precio: precio};
          this.productos.push(item);

          //var boton = document.createElement('button');
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

          // li.appendChild(document.createTextNode(producto));
          // li0.appendChild(document.createTextNode(cantidad));
          // li2.appendChild(document.createTextNode('S/. ' + precio));
          // li3.appendChild(document.createTextNode('S/. ' + importe));

          // li2.appendChild(boton);
          // li3.appendChild(document.createTextNode("Pendiente"));
          this.ELEMENT_DATA.push({producto:producto, precio:'S/. ' + precio, cantidad:cantidad, subtotal:'S/. ' + importe});
          this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA);


          // ul0.appendChild(li0);
          // ul.appendChild(li);
          // ul2.appendChild(li2);
          // ul3.appendChild(li3);

          // ul0.appendChild(hr0)
          // ul.appendChild(hr);
          // ul2.appendChild(hr2);
          // ul3.appendChild(hr3);
        }

        // var list2 = document.querySelectorAll('#friendsList2 li');
        // for (let i = 0; i < list2.length; i++) {
        //   list2[i].setAttribute("id", "list2" + i);
        //   document.getElementById("list2" + i).style.listStyle = "none";
        //   document.getElementById("list2" + i).style.textAlign = "center";
        // }

        // var list3 = document.querySelectorAll('#friendsList3 li');
        // for (let i = 0; i < list3.length; i++) {
        //   list3[i].setAttribute("id", "list3" + i);
        //   document.getElementById("list3" + i).style.listStyle = "none";
        //   document.getElementById("list3" + i).style.textAlign = "center";
        //   document.getElementById("list3" + i).style.color = "green";
        //   document.getElementById("list3" + i).style.fontWeight = "bold";
        // }

        // var buton = document.querySelectorAll('#friendsList2 li button');
        // for (let i = 0; i < buton.length; i++) {
        //   buton[i].appendChild(document.createTextNode("Verificar"));
        //   buton[i].setAttribute("class", "mat-raised-button mat-primary");
        //   buton[i].setAttribute("id", "boton" + i);
        //   document.getElementById("boton" + i).style.marginTop = "-10px";
        //   document.getElementById("boton" + i).style.marginBottom = "-10px";
        //   if (this.ventaProducto[i].estado == 1) {
        //     document.getElementById("list3" + i).style.color = "blue";
        //     document.getElementById("list3" + i).innerHTML = "Correcto";
        //     document.getElementById("boton" + i).setAttribute("disabled", "disabled");
        //   }
        //   document.getElementById("boton" + i).addEventListener('click', function (event) {
        //     let id = this.id.split("boton")[1];
        //     localStorage.setItem("id", id);
        //   });
        // }
      },
      error => {
        console.log(error)
      }
    )
  }

  // actualizarStock() {
  //   var id = Number(localStorage.getItem("id"));
  //   this.ventaProducto = JSON.parse(localStorage.getItem('ventaProducto'));
  //   for (let i = 0; i < this.ventaProducto.length; i++) {
  //     if (i == id) {
  //       document.getElementById("list3" + i).innerHTML = "Correcto";
  //       document.getElementById("list3" + i).style.color = "blue";
  //       document.getElementById("list3" + i).style.fontWeight = "bold";
  //       document.getElementById("boton" + i).setAttribute("disabled", "disabled");

  //       this._ventaProductoService.actualizarVentaProducto(this.ventaProducto[i]._id, { venta: this.ventaProducto[i].venta, producto: this.ventaProducto[i].producto, cantidad: this.ventaProducto[i].cantidad, estado: 1 }).subscribe(
  //         res => {

  //         },
  //         error => {
  //           console.log(error);
  //         }
  //       )

  //       var nuevo_stock = this.ventaProducto[i].stock - this.ventaProducto[i].cantidad;

  //       this._productoService.actualizarProducto(this.ventaProducto[i].producto, { nombre: this.ventaProducto[i].nombreProd, descripcion: this.ventaProducto[i].descripcion, stock: nuevo_stock, precio: this.ventaProducto[i].precio }).subscribe(
  //         res => {
  //           Swal.fire({
  //             type: 'success',
  //             title: 'Pedido confirmado!',
  //             text: 'Stock Actualizado',
  //             confirmButtonColor: '#3085d6',
  //             showConfirmButton: true,
  //           })
  //         }
  //       )
  //     }
  //   }
  // }

}
