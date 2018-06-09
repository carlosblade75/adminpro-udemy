import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

import swal from 'sweetalert';

// por el operador map
import 'rxjs/add/operator/map';

@Injectable()
export class HospitalService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  cargarHospitales(desde: number = 0) {

    let URL = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get(URL);
  }

  obtenerHospital( id: string ) {

    let URL = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get(URL)
    .map((resp: any) => {
      return resp.hospital;
    });
  }

  borrarHospital( id: string ) {

    let URL = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete(URL)
    .map( resp => {
      swal('Hospital borrado', 'El hospital ha sido eleminado correctamente', 'success');
      return true;
    });
  }

  crearHospital( nombre: string ) {

    let URL = URL_SERVICIOS + '/hospital?token=' + this._usuarioService.token;

    let hospital = new Hospital(nombre, '', '');

    console.log ('hospital a crear ' + hospital.nombre);

    return this.http.post(URL, hospital)
    .map((resp: any)  => {

      swal('Hospital creado', resp.hospital.nombre, 'success');
      return resp.hospital;

    });

  }

  buscarHospital( termino: string ) {

    let URL = URL_SERVICIOS + '/busqueda/coleccion/hospital/' + termino;

    return this.http.get(URL)
    .map( (resp: any) => resp.hospital );
  }

  actualizarHospital( hospital: Hospital ) {

    let URL = URL_SERVICIOS + '/hospital/' + hospital._id;

    URL += '?token=' + this._usuarioService.token;

    return this.http.put(URL, hospital)
    .map ((resp: any) => {

      swal('hospital actualizado', hospital.nombre, 'success');

      return true;
    });

  }
}
