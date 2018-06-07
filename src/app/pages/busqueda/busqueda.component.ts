import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico [] = [];
  hospitales: Hospital[] = [];

  constructor(
    public activateRoute: ActivatedRoute,
    public  http: HttpClient
  ) {

    activateRoute.params.subscribe( params => {

      let termino = params['termino'];
      this.bucar (termino);
    });
  }

  ngOnInit() {
  }

  bucar (termino: string) {

    let URL = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.http.get(URL)
    .subscribe ( (resp: any) => {

      console.log(resp);

      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;

    });
  }

}
