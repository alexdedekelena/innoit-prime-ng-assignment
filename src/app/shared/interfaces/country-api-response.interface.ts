export interface CountryApiResponse {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  currencies: any; // TODO: Check proper typing for Dictionary structure. Field represented by string
  population: number;
  status: string;
  maps: {
    googleMaps: string;
  };
  continents: string[];
}
