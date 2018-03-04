import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})

export class GraficoDonaComponent implements OnInit {

  @Input() leyenda: string = 'Leyenda';
  // Doughnut
  @Input() doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  @Input() doughnutChartData: number[] = [450, 450, 100];
  @Input() doughnutChartType: string = 'doughnut';

  constructor() { }

  ngOnInit() {
    console.log(this.doughnutChartLabels);
    console.log(this.doughnutChartData);
    console.log(this.doughnutChartType);
  }

}
