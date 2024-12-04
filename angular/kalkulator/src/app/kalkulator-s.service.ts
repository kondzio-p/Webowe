import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KalkulatorSService {

  constructor() { }

  dodaj(...liczby : number[]) : number {
    let suma = 0;
    for (let liczba of liczby) {
      suma += liczba;
    }
    return suma;
  }

  odejmij(a: number, b: number) : number {
    return a-b;
  }

  dodawanie(a: number, b: number) : number {
    return a+b;
  }  
  
  mnozenie(a: number, b: number) : number {
    return a*b;
  }

  dzielenie(a: number, b: number) : number {
    if(b===0) {
      throw new Error('Dzielisz przez 0.')
    } 
    
    return a/b;
  }
}
