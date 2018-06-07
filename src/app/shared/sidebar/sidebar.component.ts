import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})

export class SidebarComponent implements OnInit {

  usuario: Usuario;

  constructor(
    public _sidebar: SidebarService,
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this._modalUploadService.notificacion.subscribe( (resp: any) => {
      if (resp.tipo === 'usuarios') {
        this.usuario = resp.resp.usuarioActualizado;
      }
    });

    this._sidebar.cargarMenu();
  }

}
