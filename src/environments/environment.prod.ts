export const environment = {
  production: true,
  punkApi: {
    baseAddress: "https://api.punkapi.com/v2/",
    headers: [
      {
        key: "Content-Type",
        value: "application/json"
      },
    ],
    services: {
      beers: "beers",
      beerRandom: "beers/random"
    },
    paging: {
      item: 25
    }
  },
};
