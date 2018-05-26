import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/RX';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})

export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() { 

    this.subscription = this.regresaObservable().subscribe ( numero =>  { console.log('Subs ', numero); }, 
                    error => { console.log('Error en el obs (2 veces)', error); }, 
                    () => { console.log('El observador terminó!'); }
                  );
  }

  ngOnInit() {
  }

  ngOnDestroy() {

    console.log('La página se va a cerrar!');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {

     return new Observable( observer => {
      
      let contador = 0;

      let intervalo = setInterval(() => {

        contador +=1;

        let salida = {
          valor: contador
        };
        
        observer.next( salida ); 

        // if (contador === 5)
        // {
        //   clearInterval( intervalo );
        //   observer.complete();
        // }

        // if (contador === 3)
        // {
        //   observer.error('Auxilio!');
        // }

       }, 500);

     }).retry(2)
     .map( (resp: any) => { return resp.valor })
     .filter( (valor, index) => { 

      // console.log('Filter ', valor, index);

      if (valor % 2 === 1)
      {
        return true;
      }
      else
      {
        return false;
      }
     } );

  }
}
