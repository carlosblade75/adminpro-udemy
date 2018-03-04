import { Component, OnInit } from '@angular/core';
import { IncrementadorComponent } from '../../components/incrementador/incrementador.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})

export class ProgressComponent implements OnInit {

  progreso1: number = 25;
  progreso2: number = 35;

  constructor() { }

  ngOnInit() {
  }

  // actualizar(event: number) {
  //   console.log('Evento: ', event);
  // }
}
