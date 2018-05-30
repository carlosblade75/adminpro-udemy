import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

// por el operador map
import 'rxjs/add/operator/map';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable()
export class UsuarioService {


  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService) {
    // console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  cargarStorage() {
    if (this.token = localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {

      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify( usuario));

      this.usuario = usuario;
      this.token = token;

  }

  estaLogueado() {
    return (this.token.length > 5 ) ? true : false;
  }

  logOut() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }


  loginGoogle( token: string) {

    let URL = URL_SERVICIOS + '/login/google';

    return this.http.post(URL, { token: token} )
    .map( (resp: any) => {

      this.guardarStorage(resp.id, resp.token, resp.usuario);

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

      this.guardarStorage(resp.id, resp.token, resp.usuario);

      return true;
    });
  }

  crearUsuario(usuario: Usuario) {

    let URL = URL_SERVICIOS + '/usuario/' + usuario._id;

    return this.http.post(URL, usuario)
    .map((resp: any)  => {

      swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;

    });
  }

  actualizarUsuario( usuario: Usuario) {

    let URL = URL_SERVICIOS + '/usuario/' + usuario._id;

    URL += '?token=' + this.token;

    return this.http.put(URL, usuario)
    .map ((resp: any) => {

      this.guardarStorage(this.usuario._id, this.token, resp.usuario);

      swal('Usuario actualizado', usuario.nombre, 'success');

      return true;
    });
  }

  cambiarImagen(file: File, id: string) {

    this._subirArchivoService.subitArchivo(file, 'usuarios', id)
    .then( (resp: any) => {
       console.log(resp);

      this.usuario.img = resp.usuarioActualizado.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success' );
      this.guardarStorage(this.usuario._id, this.token, this.usuario);

    })
    .catch( resp => {
      console.log(resp);
    });

  }
}
