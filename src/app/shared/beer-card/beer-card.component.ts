import {Component, Input, OnInit} from '@angular/core';
import {Beer} from "../../modules/beer";

@Component({
  selector: 'app-beer-card',
  templateUrl: './beer-card.component.html',
  styleUrls: ['./beer-card.component.css']
})
export class BeerCardComponent implements OnInit {

  @Input()
  beer: Beer | null;

  constructor() {
    this.beer = null;
  }

  ngOnInit() {

  }

}
