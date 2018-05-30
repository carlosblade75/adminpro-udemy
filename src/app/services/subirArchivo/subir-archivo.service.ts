import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class SubirArchivoService {

  constructor() { }

  subitArchivo( archivo: File,  tipo: string, id: string) {

    // esto es javascript puro: ajax. angular aún no puede subir archivos

    return new Promise ( (resolve, reject) => {

      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append( 'imagen', archivo, archivo.name);

      xhr.onreadystatechange = () => {

        /// la subida ha acabado
        if (xhr.readyState ===  4) {

          if (xhr.status ===  200) {

            console.log( 'Imagen subida' );

            resolve( JSON.parse( xhr.response ));
          } else {
            console.log( 'Falló la subida' );
            reject( xhr.response);
          }
        }
      };

      let URL = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

      xhr.open('PUT', URL, true);
      xhr.send( formData);

    } );

  }


}
