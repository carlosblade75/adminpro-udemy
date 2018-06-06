import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: []
})
export class HospitalesComponent implements OnInit {

  desde: number = 0;
  cargando: boolean = true;
  hospitales: Hospital[]  = [];

  totalRegistros: number = 0;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe( (resp: any) => {
      // console.log (resp.resp.hospitalActualizado);
      this.cargarHospitales();
      });

  }

  cargarHospitales() {

    this.cargando = true;

    this._hospitalService.cargarHospitales(this.desde)
    .subscribe((resp: any) => {

      console.log (resp.hospitales);

      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }

  borrarHospital( hospital: Hospital) {

    swal({
      title: '¿Está seguro?',
      text: 'Esta a punto de borrar a' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then((borrar ) => {

    if (borrar) {

      this._hospitalService.borrarHospital(hospital._id)
      .subscribe((borrado) => {

        this.cargarHospitales();
      });

    }

    });
  }

  actualizarHospital( hospital: Hospital) {
    // console.log (hospital);
    this._hospitalService.actualizarHospital( hospital )
    .subscribe();
  }

  crearHospital() {

    swal('Por favor, introduzca un nombre de hospital:', {
      content: 'input',
    })
    .then((value) => {

      if (!value || value.length === 0) {
        return;
      }

      this._hospitalService.crearHospital(value)
      .subscribe((resp: any) => {
 // console.log(resp);
        this.cargarHospitales();
        swal(`Hospital ${value}  creado.`);
        // swal('Hospital ' + resp.hospital.nombre + ' creado.');
      });

    });

  }

  buscarHospital( termino: string) {

    if (termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino)
    .subscribe( (hospitales: Hospital[]) => {

      this.hospitales = hospitales;

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

    this.cargarHospitales();

  }

  mostrarModal (id: string) {

    this._modalUploadService.mostrarModal('hospitales', id);
  }
}
