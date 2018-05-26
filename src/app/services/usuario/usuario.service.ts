import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

// por el operador map
import 'rxjs/add/operator/map';

@Injectable()
export class UsuarioService {


  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router) {
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

    let URL = URL_SERVICIOS + '/usuario';

    return this.http.post(URL, usuario)
    .map((resp: any)  => {

      swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;

    });
  }

}
