import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { PacienteModel } from '../../models/paciente.model';
import { ImagenModel } from '../../models/imagen.model';
declare var $: any;
// import { Rol } from '../../helpers/role.helper';
// import { Global } from '../../services/global';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-diagnostico-add',
  templateUrl: './diagnostico-add.component.html',
  styleUrls: ['./diagnostico-add.component.css'],
  providers: [DiagnosticoService]
})
export class DiagnosticoAddComponent implements OnInit {
  options: any[] = [];
  options2: any[] = [];
  filteredOptions: Observable<PacienteModel[]>;
  filteredOptions2: Observable<ImagenModel[]>;
  imagen: string;
  resultado_diagnostico: string;
  nivel_precision: number;
  // url: string;
  nuevoDiagnosticoForm: FormGroup;
  // public empleado: any;
  // roles: Rol[] = [
  //   { value: 'ADMIN', viewValue: 'Admin' },
  //   { value: 'COMPRAS', viewValue: 'Compras' },
  //   { value: 'VENTAS', viewValue: 'Ventas' }
  // ];

  constructor(
    private _diagnosticoService: DiagnosticoService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _router: Router
  ) { 
    // this.url = Global.url;
  }

  ngOnInit() {
    // var xhr = new XMLHttpRequest();       
    // xhr.open("GET", "../../../assets/empty.jpg", true); 
    // xhr.responseType = "blob";
    // xhr.onload = function (e) {
    //         console.log(this.response);
    //         var reader = new FileReader();
    //         reader.onload = function(event) {
    //            var res = event.target.result;
    //            console.log(res)
    //         }
    //         var file = this.response;
    //         reader.readAsDataURL(file)
    // };
    // xhr.send()
    this.buildForm();
    // this.dniParam = this.route.snapshot.paramMap.get('dni');
    // this.buildForm();
    // this._empleadoService.buscarEmpleado(this.dniParam).subscribe(
    //   res => {
    //     //console.log(res);
    //     this.empleado = res.empleado[0];
    //     //console.log(this.empleado)
    //     this.editEmpleadoForm.patchValue({
    //       nombres: this.empleado.nombres,
    //       apellidos: this.empleado.apellidos,
    //       direccion: this.empleado.direccion,
    //       email: this.empleado.email,
    //       dni: this.empleado.dni,
    //       edad: this.empleado.edad,
    //       role: this.empleado.role
    //     })
    //   }
    // )

    // PARA LLENAR EL ARRAY DE PROVEEDORES EN EL AUTOCOMPLETADO
    this._diagnosticoService.listarPacientes().subscribe(result => {
      this.options = result.paciente;
      this.filteredOptions = this.nuevoDiagnosticoForm.controls['paciente'].valueChanges
        .pipe(
          startWith<string | PacienteModel>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(name => name ? this._filter(name) : this.options.slice())
        );
    });
  }

  displayFn(user?: PacienteModel): string | undefined {
    return user ? user.nombres + ' ' + user.apaterno : undefined;
  }

  private _filter(name: string): PacienteModel[] {
    const filterValue = name.trim().toLowerCase();
    return this.options.filter(option => option.nombres.toLowerCase().indexOf(filterValue) != -1 ||
      option.apaterno.toLowerCase().indexOf(filterValue) != -1 ||
      option.dni.toLowerCase().indexOf(filterValue) != -1);
  }

  private _filter2(name: string): ImagenModel[] {
    const filterValue2 = name.trim().toLowerCase();
    return this.options.filter(option2 => option2.ruta_imagen.toLowerCase().indexOf(filterValue2) != -1);
  }

  private buildForm() {
    return this.nuevoDiagnosticoForm = this.formBuilder.group({
      paciente: ['', [Validators.maxLength(60), Validators.minLength(4), Validators.required]],
      imagen: ['', [Validators.maxLength(60), Validators.minLength(4), Validators.required]],
      oftalmologo: [JSON.parse(localStorage.getItem("oftalmologo")).nombres + " " + JSON.parse(localStorage.getItem("oftalmologo")).apaterno, [Validators.required]],
      diagnostico_medico: ['', [Validators.maxLength(60), Validators.minLength(4), Validators.required]],
      resultado_diagnostico: ['', [Validators.maxLength(60), Validators.minLength(4), Validators.required]]
      // direccion: ['', [Validators.maxLength(80), Validators.minLength(10), Validators.required]],
      // email: ['', [Validators.required]],
      // dni: ['', [Validators.maxLength(8), Validators.required]],
      // edad: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      // role: ['', [Validators.required]]
    });
  }

  cambiarPaciente(id_paciente){
    this._diagnosticoService.listarImagenesPaciente(id_paciente).subscribe(result => {
      this.options2 = result.imagen;
      this.filteredOptions2 = this.nuevoDiagnosticoForm.controls['imagen'].valueChanges
        .pipe(
          startWith<string | ImagenModel>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(name => name ? this._filter2(name) : this.options2.slice())
        );
    });
  }

  mostrarImagen(imagen){
    this.imagen = imagen;
  }

  guardar_diagnostico() {
    //console.log('form', this.nuevoDiagnosticoForm.value)
    if (this.nuevoDiagnosticoForm.valid){
      var id_oftalmologo = JSON.parse(localStorage.getItem("oftalmologo")).id_oftalmologo;
      var id_imagen = this.nuevoDiagnosticoForm.value.imagen.id_imagen;
      var ruta = this.nuevoDiagnosticoForm.value.imagen.ruta_imagen;
      var nivel_precision = this.nivel_precision * 100;
      var f = new Date();
        var año = f.getFullYear();
        var mes = String(f.getMonth() +1);
        var mes1 = f.getMonth() +1;
        var dia = String(f.getDate());
        var dia1 = f.getDate();
        if(mes1 < 10){
            mes = "0" + mes;
        }
        if(dia1 < 10){
            dia = "0" + dia;
        }
        var fecha =  año + "-" + mes + "-" + dia;
        var diagnostico_sistema = this.nuevoDiagnosticoForm.value.resultado_diagnostico;
        var diagnostico_especialista = this.nuevoDiagnosticoForm.value.diagnostico_medico;
        // console.log(id_oftalmologo);
        // console.log(id_imagen);
        // console.log(ruta);
        // console.log(nivel_precision);
        // console.log(fecha);
        // console.log(diagnostico_sistema);
        // console.log(diagnostico_especialista);
      this._diagnosticoService.guardarDiagnostico({id_oftalmologo:id_oftalmologo,id_imagen:id_imagen,ruta:ruta,nivel_precision:nivel_precision,algoritmo:"VGG16",fecha:fecha,diagnostico_sistema:diagnostico_sistema,diagnostico_especialista:diagnostico_especialista}).subscribe(
        res => {
              Swal.fire({
                type: 'success',
                title: 'La operación fue exitosa!',
                text: 'Diagnostico guardado correctamente.'
              });
            },
            err => { console.log(err) }
      )
      // this._empleadoService.actualizarEmpleado(this.empleado._id, this.nuevoDiagnosticoForm.value).subscribe(
      //   res => {
      //     Swal.fire({
      //       type: 'success',
      //       title: 'La operación fue exitosa!',
      //       text: 'Editado correctamente.'
      //     }).then((result) => {
      //       if (result.value) {
      //         this._router.navigateByUrl('/home/empleados')
      //       }
      //     });
      //   },
      //   err => { console.log(err) }
      // )
    }
    else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Coloque correctamente los datos'
      })
    }
  }

  ejecutar_diagnostico() {
    //console.log('form', this.nuevoDiagnosticoForm.value);
    var imagen = document.getElementById("imagen");
    fetch(imagen["src"])
    .then(res => res.blob())
    .then(blob => {
        const file = new File([blob], "1c578b72d7b3.png", {
            type: 'image/png'
        });
        //console.log(file);
        
    // console.log(this.nuevoDiagnosticoForm.controls.img);
    var formData = new FormData();
    console.log(file);
    formData.append("file", file);
    //console.log(imagen);

    if (this.nuevoDiagnosticoForm.controls.paciente.valid && this.nuevoDiagnosticoForm.controls.imagen.valid){
      fetch('http://34.71.45.5:5000/model/direh/', {
          method: 'POST',
        
          body: formData
      })
      .then(function(response) {
          //console.log('response =', response.json());
          response.json().then((value) => {
            
            //console.log(value.predictions[0]);
            localStorage.setItem("prediccion",JSON.stringify(value.predictions[0]));

            // expected output: 123
          });
          //return response.json();
      })
      .then(function(data) {
          //console.log('data = ', data);
      })
      .catch(function(err) {
          console.error(err);
      });

      setTimeout(() => {
        this.resultado_diagnostico = JSON.parse(localStorage.getItem("prediccion"));
        this.nivel_precision = this.resultado_diagnostico["score"];
        console.log(this.resultado_diagnostico);
        if(this.resultado_diagnostico["label"] == "retinopatia"){
          this.nuevoDiagnosticoForm.controls['resultado_diagnostico'].setValue("Positivo");
        }
        else{
          this.nuevoDiagnosticoForm.controls['resultado_diagnostico'].setValue("Negativo");
        }
      }, 2000);
      
    //   $.ajax({
    //     type: "POST",
    //     enctype: 'multipart/form-data',
    //     url: "http://34.71.45.5:5000/model/direh/",
    //     data: formData,
    //     processData: false,
    //     contentType: false,
    //     cache: false,
    //     success: (data) => {
    //         console.log(data);
    //         alert("yes");
    //     },
    //     error: function(xhr, status, error) {
    //         alert(xhr.responseText);
    //     }
    // });
      // this._diagnosticoService.realizarDiagnostico(formData).subscribe(result => {
      //   console.log(result);
      // });
      // this._empleadoService.actualizarEmpleado(this.empleado._id, this.nuevoDiagnosticoForm.value).subscribe(
      //   res => {
      //     Swal.fire({
      //       type: 'success',
      //       title: 'La operación fue exitosa!',
      //       text: 'Editado correctamente.'
      //     }).then((result) => {
      //       if (result.value) {
      //         this._router.navigateByUrl('/home/empleados')
      //       }
      //     });
      //   },
      //   err => { console.log(err) }
      // )
    }
    else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Coloque correctamente los datos'
      })
    }
  });
  }
  


}
