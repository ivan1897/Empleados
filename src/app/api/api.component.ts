import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ApiService } from '../api-service.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { Empleado } from '../models/empleado.model';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css'],
})
 

export class ApiComponent implements OnInit {

  datos: any ; // Variable para almacenar los datos de la API
  datos_user: any = {};
  nuevoDato: any = {};
  datoSeleccionado: any = {};
  userForm!: FormGroup;
  editForm!: FormGroup;
  empleado: Empleado = {};
  filterPost = '';
  //Datos para la paginacion
  itemsPerPage = 2;
  public page!: number;

  /*@HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const telefonoInput = event.target as HTMLInputElement;
    const maxLength = 8; // Longitud máxima permitida

    let numericValue = '';
    for (let i = 0; i < telefonoInput.value.length; i++) {
      const char = telefonoInput.value.charAt(i);
      if (!isNaN(Number(char))) {
        numericValue += char;
      }
    }

    if (numericValue.length > maxLength) {
      numericValue = numericValue.slice(0, maxLength); // Limitar la longitud al máximo permitido
      
    }
    telefonoInput.value = numericValue;
      telefonoInput.dispatchEvent(new Event('input')); // Disparar evento 'input' para actualizar el valor en el formulario
  }*/

  
  constructor(
    private servicio: ApiService,
    public formBuilder: FormBuilder
    ) {

      this.userForm = this.formBuilder.group({
        nombre: new FormControl('', Validators.required),
        apellido: new FormControl('', Validators.required),
        correo: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
        telefono: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.maxLength(8)]),
        nombre_departamento: new FormControl('', Validators.required),
        nombre_municipio: new FormControl('', Validators.required),
      })
      

      this.editForm = this.formBuilder.group({
        id: [''],
        nombre: new FormControl('', Validators.required),
        apellido: new FormControl('', Validators.required),
        correo: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
        telefono: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.maxLength(10)]),
        nombre_departamento: new FormControl('', Validators.required),
        nombre_municipio: new FormControl('', Validators.required),
      })
     }
     
    

  ngOnInit(): void {
    this.obtenerDatosDeAPI();
  }

  obtenerDatosDeAPI(): void {
    
    this.servicio.obtenerDatos().subscribe(
      (response) => {
        this.datos = response;
      },
      (error) => {
        console.error('Ocurrió un error al obtener los datos:', error);
      }
    );
    
  }
  

  crearDato(): void {
    this.userForm.markAllAsTouched();


     this.empleado = {
      nombre_departamento: this.userForm.controls['nombre_departamento'].value,
      nombre_municipio: this.userForm.controls['nombre_municipio'].value,
      nombre: this.userForm.controls['nombre'].value,
      apellido: this.userForm.controls['apellido'].value,
      correo: this.userForm.controls['correo'].value,
      telefono: this.userForm.controls['telefono'].value
      
     }

     if (this.userForm.valid){

      // console.log("test", this.empleado);
    this.servicio.crearDato(this.empleado).subscribe(
      (response) => {
        console.log('Dato creado exitosamente:', response);
        this.obtenerDatosDeAPI();
        this.nuevoDato = {};
        window.location.reload();
        },
        (error) => {
          console.error('Ocurrió un error al crear el dato:', error);
          window.location.reload();
        }
      );

     }else{

      console.log("no valido");
     }




    
  }

  seleccionarDato(dato: any): void {
    this.datoSeleccionado = { ...dato };
  }

  editItem(item: any) {
    this.datoSeleccionado = { ...item };
    this.editForm.patchValue({
      id: this.datoSeleccionado.id,
      nombre: this.datoSeleccionado.empleados.nombre,
      apellido: this.datoSeleccionado.empleados.apellido,
      telefono: this.datoSeleccionado.empleados.telefono,
      correo: this.datoSeleccionado.empleados.correo,
      nombre_departamento: this.datoSeleccionado.nombre_departamento,
      nombre_municipio: this.datoSeleccionado.nombre_municipio
    });
    console.log("test", this.datoSeleccionado.nombre_municipio);
  }

  actualizarDato(): void {

    console.log("test", this.editForm.controls['nombre'].value);
    this.datoSeleccionado = {
      id: this.editForm.controls['id'].value,
      nombre: this.editForm.controls['nombre'].value,
      apellido: this.editForm.controls['apellido'].value,
      telefono: this.editForm.controls['telefono'].value,
      correo: this.editForm.controls['correo'].value,
      nombre_departamento: this.editForm.controls['nombre_departamento'].value,
      nombre_municipio: this.editForm.controls['nombre_municipio'].value
      
     }

    console.log("test", this.editForm.controls);

    
    
    this.servicio.actualizarDato(this.datoSeleccionado.id, this.datoSeleccionado).subscribe(
      (response) => {
        console.log('Dato actualizado exitosamente:', response);
        this.obtenerDatosDeAPI();
        this.datoSeleccionado = {};
        window.location.reload();
      },
      (error) => {
        console.error('Ocurrió un error al actualizar el dato:', error);
        window.location.reload();
      }
    );
    
  }
  eliminarDato(): void {
    this.datoSeleccionado = {
      id: this.editForm.controls['id'].value,
    
      
     }
    this.servicio.eliminarDato(this.datoSeleccionado.id).subscribe(
      (response) => {
        console.log('Dato eliminado exitosamente:', response);
        this.obtenerDatosDeAPI();
        window.location.reload();
      },
      (error) => {
        console.error('Ocurrió un error al eliminar el dato:', error);
        window.location.reload();
      }
    );
  }

}

