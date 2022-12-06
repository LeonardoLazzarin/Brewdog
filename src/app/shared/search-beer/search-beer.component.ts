import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {defaultFilterBeer, FilterBeer} from "../../modules/beerFilter";

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
    this.filter = defaultFilterBeer();
  }

  ngOnInit(): void {
    this.filter = defaultFilterBeer();
  }

  onFilterClick() {
    const err = this.getErrorFilter();
    if (err != null) {
      this.onErrorInput.emit(err);
      return;
    }

    // Remove start and end space for beer name and food combination
    this.filter.beerName = this.filter.beerName.trimStart().trimEnd();
    this.filter.foodCombination = this.filter.foodCombination.trimStart().trimEnd();

    // Emit a copy of object
    this.onFilter.emit({
      beerName: this.filter.beerName,
      foodCombination: this.filter.foodCombination,
      alcohol: {
        from: this.filter.alcohol.from,
        to: this.filter.alcohol.to
      }
    });
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
    if (this.filter.beerName == null) {
      return 'You must insert a valid beer name';
    }
    if (this.filter.foodCombination == null) {
      return 'You must insert a valid food combination';
    }
    if (
      this.filter.alcohol.from != null && this.filter.alcohol.to != null &&
      this.filter.alcohol.from > this.filter.alcohol.to
    ) {
      return 'You must insert a valid range for alcohol component';
    }
    return null;
  }

}
