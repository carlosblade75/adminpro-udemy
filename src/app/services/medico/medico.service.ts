import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../../models/medico.model';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';

import swal from 'sweetalert';

@Injectable()
export class MedicoService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos(desde: number = 0) {

    let URL = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get(URL);
  }

  buscarMedico( termino: string) {

    let URL = URL_SERVICIOS + '/busqueda/coleccion/medico/' + termino;

    return this.http.get(URL)
    .map( (resp: any) => resp.medico );

  }

  borrarMedico( medico: Medico) {

    let URL = URL_SERVICIOS + '/medico/' + medico._id + '?token=' + this._usuarioService.token;

    return this.http.delete(URL)
    .map( resp => {
      swal('Médico borrado', 'El médico ha sido eleminado correctamente', 'success');
      return true;
    });
  }

  guardarMedico(medico: Medico) {

    let URL = URL_SERVICIOS + '/medico';

    if (medico._id ) {
      // actualizando
      URL += '/' + medico._id + '?token=' + this._usuarioService.token;

      return this.http.put(URL, medico)
      .map((resp: any)  => {

        swal('Médico actualizado', resp.medico.nombre, 'success');
        return resp.medico;

      });

    } else {
      // creando
      URL += '?token=' + this._usuarioService.token;

      return this.http.post(URL, medico)
      .map((resp: any)  => {

        swal('Médico creado', resp.medico.nombre, 'success');
        return resp.medico;

      });
    }

  }

  cargarMedico( id: string ) {

    let URL = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(URL)
    .map( (resp: any) => resp.medico );
  }

}
