import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../score.service';
import { Score } from '../score';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  // Pelin muuttujien esittely on tässä
  // Pelin tila eli state tallennetaan squares -taulukkoon
  squares: any[]; // Taulukko jossa on eri tyyppisiä arvoja: null, 'X', '0'
  xIsNext: boolean; // Kertoo kumpi on seuraavaksi vuorossa
  winner: string; // Kertoo voittajan 'X' tai '0'
  moves: number; // Tarvitaan määrittämään koska peli päättyy
  tie: boolean; // Ilmaisee tasapelin, true tai false
  scores: Score; // Pelin tilanne
  line: number[]; // taulukko jossa on voittajan rivin indeksinumerot

  constructor(private scoreService: ScoreService) { }

  ngOnInit(): void {
    this.scoreService.initScores();
    this.newGame(); // newGame suoritetaan aina kun komponentti alustetaan
  }

  // newGame() -metodin suoritus käynnistää uuden pelin
  newGame() {
    // Kun uusi peli alkaa, pelin muuttujat alustetaan.
    // Squares-taulukkoon laitetaan 9 tyhjää paikkaa
    this.squares = Array(9).fill(null);
    // Vaihdetaan arvoksi true tai false riippuen siitä
    // mikä oli viimeinen arvo edellisessä pelissä
    // ehto ? arvo jos totta : arvo jos epätosi
    this.xIsNext = this.xIsNext ? true : false;
    this.winner = null;
    this.moves = 0;
    this.tie = false;
    this.scores = this.scoreService.getScores();
    this.line = [null, null, null];
  }

  /*
   Tässä on sovelluksen model eli tietomalli. Se muodostuu
   risteistä ja nollista jotka välitetään ruutuihin player-
   get propertyn kautta. Get property joka on TS:n piirre,
   tarjoilee vuorotellen ristin tai nollan.
   */
  get player() {
    // ternäärinen operaattori joka korvaa if-elsen
    return this.xIsNext ? 'X' : '0';
    /*
    if (this.xIsNext) {
        return 'X';
    } else {
        return '0';
    }
    */
  }

  // Tyhjennetään localstoragen pelitilanne
  nullifyScores() {
    this.scoreService.initScores(); // asetetaan 0-0 tilanne
    this.scores = this.scoreService.getScores(); // haetaan tilanne komponentti
  }

  // Tehdään pelissä siirto eli laitetaan risti tai nolla paikoilleen
  // makeMove(index: number) laittaa ristin tai nollan squares -taulukkoon indeksiin index
  makeMove(index: number) {
    // Estetään pelaajaa tekemästä siirto jos voittaja on olemassa ja
    // siirtoja on alle 9
    if (this.moves < 9 && this.winner !== null) {
      return null; // häivytään metodista ja siirtoa ei voi tehdä
    }

    // Paikan johon risti tai nolla laitetaan pitää olla tyhjä, eli null
    if (!this.squares[index]) {
      // splice-metodi poistaa indeksistä alkion ja laittaa
      // tilalle yhden alkion joka tulee this.player -get propertyltä
      this.squares.splice(index, 1, this.player);
      this.xIsNext = !this.xIsNext; // Vaihdetaan vuoroa
      this.moves++;
    }
    // Yritetään määritellä voittaja. Metodi tuottaa 'X', '0' tai null
    // tilanteesta riippuen. Jos voittaja on olemassa, se näytetään templaatissa.
    this.winner = this.calculateWinner();

    // Tässä määritellään tasapeli
    if (this.moves === 9 && this.winner === null) {
      this.tie = true;
    }
  }

  // Metodi joka määrittää pelin voittajan
  /*
  Muut jutut kuin pelin voittamisen määrittely voisivat 
  mieluummin olla omassa metodissaan, sillä hyvä periaate on
  että yksi metodi tekee vain yhtä asiaa.
  */
  calculateWinner() {
    //mahdolliset voittorivit
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    //käydään läpi lines taulukkoa rivi kerrallaan
    for (const line of lines) {
      //otetaan indexit a, b, ja c muuttujiin
      const [a, b, c] = line;
      if (
        //alkiot ovat samoja taulukossa eli siellä on jonkinlainen kolmen rivi
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        // otetaan talteen voittajan rivi joka saadaan yläpuolella olevan if:n vertailun avulla
        this.line = line;
        // scoren lisääminen pelin voittajalle
        this.scoreService.addScore(this.squares[a]);
        // Kun tilanne muuttui, haetaan uusi tilanne
        this.scores = this.scoreService.getScores();
        return this.squares[a]; // palautetaan 'X' tai '0'
      }
    }
    return null;
  }
}
