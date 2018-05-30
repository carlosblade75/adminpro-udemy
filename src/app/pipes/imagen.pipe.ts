import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/img';

    if ( imagen.indexOf('https') >= 0) {
      return imagen;
    }

    if (!imagen) {
      return url + '/usuarios/imagenPorDefecto';
    }

    switch (tipo) {
      case 'usuario':
         url += '/usuarios/' + imagen;
      break;
      case 'medico':
         url += '/medicos/' + imagen;
      break;
      case 'hospital':
         url += '/hospitales/' + imagen;
      break;
      default:
        console.log('Tipo de imagen no existe, usuario, medico u hospital');
        url += '/usuarios/imagenPorDefecto';
      break;
    }

    return url;
  }

}
