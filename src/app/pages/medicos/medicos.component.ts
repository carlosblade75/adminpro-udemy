import { Component, OnInit } from '@angular/core';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { MedicoService } from '../../services/medico/medico.service';
import { Medico } from '../../models/medico.model';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  desde: number = 0;
  cargando: boolean = true;
  medicos: Medico[]  = [];
  totalRegistros: number = 0;

  constructor(
    public _medicoService: MedicoService,
    public _modalUploadService: ModalUploadService
  ) {
    this.cargarMedicos();
  }

  ngOnInit() {
  }

  cargarMedicos() {

    this.cargando = true;

    this._medicoService.cargarMedicos(this.desde)
    .subscribe((resp: any) => {

      console.log (resp.medicos);

      this.totalRegistros = resp.total;
      this.medicos = resp.medicos;
      this.cargando = false;

    });

  }

  buscarMedico( termino: string) {

    if (termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedico(termino)
    .subscribe( (medicos: Medico[]) => {

      this.medicos = medicos;

    } );

  }

  cambiarDesde(valor: number) {

    let desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    console.log(valor);
    this.desde += valor;

    this.cargarMedicos();

  }

  borrarMedico(medico: Medico) {

    swal({
      title: '¿Está seguro?',
      text: 'Esta a punto de borrar a' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then((borrar ) => {

      if (borrar) {

        this._medicoService.borrarMedico(medico)
        .subscribe((borrado) => {

          this.cargarMedicos();
        });

      }

    });
  }

}
