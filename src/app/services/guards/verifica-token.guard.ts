import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  )  {

  }

  canActivate(): Promise<boolean> | boolean {

    console.log('Token guard');

    let token = this._usuarioService.token;
    let payload = JSON.parse( atob(token.split('.')[1]) );

    // console.log(payload);

    let expirado = this.expirado( payload.exp );

    if (expirado) {
      this.router.navigate(['/login']);
      return false;

    }

    return this.verificaRenueva( payload.exp );
  }

  verificaRenueva( fechaExp: number ): Promise<boolean> {

    return new Promise( ( resolve, reject) => {

      // la fecha esta en segundos
      let tokenExp =  new Date( fechaExp * 1000);
      let ahora = new Date();

      // pongo la fecha del sistema mas dos horas más
      ahora.setTime( ahora.getTime() + (1 * 60 * 60 * 1000) );

      // si la fecha de expiración del token es mayor significa que no debo renovar
      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
         this._usuarioService.renuevatoken()
         .subscribe( () => {
                      resolve(true);
                     },
                    () => {
                      this.router.navigate(['/login']);
                      reject (false);
                    });
                  }

    });
  }

  expirado( fechaExp: number ) {

    // la fecha esta en milisegundos
    let  ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora) {
      return true;
    } else {
      return false;
    }

  }
}
