import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

import swal from 'sweetalert';

// por el operador map
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';


@Injectable()
export class UsuarioService {


  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService) {
    // console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  renuevatoken() {

    let URL = URL_SERVICIOS + '/login/renuevatoken';

    URL += '?token=' + this.token;

    return this.http.get(URL)
    .map ( (resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);

        console.log('Token renovado');
        return true;
    })
    .catch( err => {

      this.router.navigate(['/login']);
      swal('No se pudo renovar tokent', 'No fue posible renovar token', 'error');

      return Observable.throw( err );
    });

  }

  cargarStorage() {
    if (this.token = localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario') );
      this.menu = JSON.parse(localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {

      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify( usuario));
      localStorage.setItem('menu', JSON.stringify( menu));

      this.usuario = usuario;
      this.token = token;
      this.menu = menu;

  }

  estaLogueado() {
    return (this.token.length > 5 ) ? true : false;
  }

  logOut() {
    this.menu = null;
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }


  loginGoogle( token: string) {

    let URL = URL_SERVICIOS + '/login/google';

    return this.http.post(URL, { token: token} )
    .map( (resp: any) => {

      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);

      return true;
    });
  }

  login(usuario: Usuario, recordar: boolean) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let URL = URL_SERVICIOS + '/login';

    return this.http.post(URL, usuario)
                      .map( (resp: any) => {
                        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                        return true;
                      })
                      .catch( err => {

                        swal('Error en  el login', err.error.mensaje, 'error');

                        return Observable.throw( err );
                      });
    }

  crearUsuario(usuario: Usuario) {

    let URL = URL_SERVICIOS + '/usuario';

    return this.http.post(URL, usuario)
                          .map((resp: any)  => {

                            swal('Usuario creado', usuario.email, 'success');
                            return resp.usuario;

                          })
                          .catch( err => {

                            console.log (err);
                            swal(err.error.mensaje, err.error.errors.message, 'error');

                            return Observable.throw( err );
                          });
  }

  actualizarUsuario( usuario: Usuario) {

    let URL = URL_SERVICIOS + '/usuario/' + usuario._id;

    URL += '?token=' + this.token;

    return this.http.put(URL, usuario)
                            .map ((resp: any) => {

                              // solo guardamos en el localstore si es el usuario logado
                              if ( usuario._id === this.usuario._id)  {
                                this.guardarStorage(this.usuario._id, this.token, resp.usuario, this.menu);
                              }

                              swal('Usuario actualizado', usuario.nombre, 'success');

                              return true;
                            })
                            .catch( err => {

                              console.log (err);
                              swal(err.error.mensaje, err.error.errors.message, 'error');

                              return Observable.throw( err );
                            });
  }

  cambiarImagen(file: File, id: string) {

    this._subirArchivoService.subitArchivo(file, 'usuarios', id)
    .then( (resp: any) => {
       console.log(resp);

      this.usuario.img = resp.usuarioActualizado.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success' );
      this.guardarStorage(this.usuario._id, this.token, this.usuario, this.menu);

    })
    .catch( resp => {
      console.log(resp);
    });

  }

  cargarUsuarios(desde: number = 0) {

    let URL = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(URL);
  }

  buscarUsuario( termino: string) {

    let URL = URL_SERVICIOS + '/busqueda/coleccion/usuario/' + termino;

    return this.http.get(URL)
    .map( (resp: any) => resp.usuario );

  }

  borrarUsuario( id: string) {

    let URL = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;

    return this.http.delete(URL)
    .map( resp => {
      swal('Usuario borrado', 'El usuario ha sido eleminado correctamente', 'success');
      return true;
    });
  }
}
