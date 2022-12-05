export interface FilterBeer {
  beerName: string,
  foodCombination: string,
  alcohol: {
    from: number | null,
    to: number | null
  }
}

export function defaultFilterBeer(): FilterBeer {
  return {
    beerName: "",
    foodCombination: "",
    alcohol: {
      from: 0,
      to: 0
    }
  }
}
