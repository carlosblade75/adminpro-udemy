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

    let URL = URL_SERVICIOS + '/usuario';

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

      // solo guardamos en el localstore si es el usuario logado
      if ( usuario._id === this.usuario._id)  {
        this.guardarStorage(this.usuario._id, this.token, resp.usuario);
      }

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
