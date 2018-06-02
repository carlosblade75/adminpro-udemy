import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File = null;
  imagenTemp: string;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cerrarModal();
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this._modalUploadService.ocultarModal();
  }

  seleccionImagen( archivo: File) {

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image')  < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    // javascript nativo o vanilla javascript

    let reader = new FileReader();

    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  subirImagen() {

    this._subirArchivoService.subitArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
        .then ( (resp: any) => {

          this._modalUploadService.notificacion.emit( {resp: resp,
                                                      tipo: this._modalUploadService.tipo}
                                                    );

          this.cerrarModal();
        })
        .catch ( err => {
          console.log('Error en la carga...');
        });
  }

}
