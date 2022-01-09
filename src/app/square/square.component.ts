import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  /*
    @Input() tarkoittaa että value -muuttujan arvo tulee syötteenä sisään äitikomponentilta.
    X ja O ovat mahdolliset sisään tulevat arvot, muita ei hyväksytä. Pystyviiva on
    Typescriptin unioni -merkintä.
    */
   @Input() value: 'X' | '0';
   @Input() line: number[]; // tuodaan taulukko jossa on voittajan rivin indeksi
   @Input() index: number; // tuodaan square -komponentin indeksi

  constructor() { }

  ngOnInit(): void {
  }

}
