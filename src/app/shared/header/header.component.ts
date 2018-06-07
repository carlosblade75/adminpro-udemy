import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService,
    public router: Router) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;

    this._modalUploadService.notificacion.subscribe( (resp: any) => {
      if (resp.tipo === 'usuarios') {
        this.usuario = resp.resp.usuarioActualizado;
      }
    });
  }

  buscar ( termino: string) {

    this.router.navigate(['/busqueda', termino]);

  }

}
