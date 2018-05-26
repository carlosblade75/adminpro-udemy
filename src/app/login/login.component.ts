import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;

  auth2: any;

  constructor( public router: Router,
               public _usuarioService: UsuarioService) { }

  ngOnInit() {

    init_plugins();

    this.googleInit();

    this.email = localStorage.getItem('email')  || '';

    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '920949832924-vffitbame4mbj6okk5blkg1m02risihp.apps.googleusercontent.com',
        cookiepolicy: 'single_host_orgin',
        scope: 'profile email'
      });

      this.attachSignIn( document.getElementById('btnGoogle'));

    });
  }

  attachSignIn( element  ) {

    this.auth2.attachClickHandler( element, {}, googleUser  => {

      let token = googleUser.getAuthResponse().id_token;
      // let profile = googleUser.getBasicProfile();

      this._usuarioService.loginGoogle( token )
      .subscribe( () => this.router.navigate(['/dashboard']));
    });
  }

  ingresar( forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    let usuario = new Usuario(
      null,
      forma.value.email,
      forma.value.password
    );

    this._usuarioService.login(usuario, forma.value.recuerdame)
      .subscribe(correcto => this.router.navigate(['/dashboard']) );

    // console.log(forma.valid);
    // console.log(forma.value);
    // this.router.navigate([ '/dashboard']);
  }
}
