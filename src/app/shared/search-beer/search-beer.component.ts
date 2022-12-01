import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface FilterBeer {
  nameCombination: string,
  alcohol: {
    from: number | null,
    to: number | null
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
  onErrorInput = new EventEmitter<string>();
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
    const err = this.getErrorFilter();
    if (err != null) {
      this.onErrorInput.emit(err);
      return;
    }

    // Remove start and end space
    this.filter.nameCombination = this.filter.nameCombination.trimStart().trimEnd();
    this.onFilter.emit(this.filter);
  }

  /**
   * Check if the key pressed is a number with a regex. If it isn't prevent input
   * @param event Keyboard event
   */
  onlyNumberInput(event: KeyboardEvent) {
    const pattern = /^[0-9]*$/;
    const key = event.keyCode || event.charCode;
    const inputChar = String.fromCharCode(key);
    if (!pattern.test(inputChar) && key !== 8 && key !== 46) {
      // Invalid char
      event.preventDefault();
    }
  }

  /**
   * Check if the filter is valid
   * @return The error found otherwise null
   */
  getErrorFilter(): string | null {
    if (this.filter.nameCombination == null) {
      return 'You must insert a valida name or combination';
    }
    if (
      this.filter.alcohol.from != null && this.filter.alcohol.to != null &&
      this.filter.alcohol.from > this.filter.alcohol.to
    ) {
      return 'The "From" content must be equal or minor of "To"';
    }
    return null;
  }

}
