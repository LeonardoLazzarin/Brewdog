import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface FilterBeer {
  nameCombination: string,
  alcohol: {
    from: number,
    to: number
  }
}

@Component({
  selector: 'app-search-beer',
  templateUrl: './search-beer.component.html',
  styleUrls: ['./search-beer.component.css']
})
export class SearchBeerComponent implements OnInit {

  @Input()
  disableFilter: boolean = false

  @Output()
  onFilter = new EventEmitter<FilterBeer>();

  filter: FilterBeer;

  constructor() {
    this.filter = {
      nameCombination: "",
      alcohol: {
        from: 0,
        to: 0
      }
    }
  }


  ngOnInit(): void {
    this.resetFilter();
  }

  resetFilter() {
    this.filter = {
      nameCombination: "",
      alcohol: {
        from: 0,
        to: 0
      }
    }
  }

  onFilterClick() {
    this.onFilter.emit(this.filter);
  }

}
