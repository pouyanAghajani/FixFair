export type ServiceCategory =
  | "bodywork"
  | "paint"
  | "mechanical"
  | "electrical"
  | "glass"
  | "tires"
  | "ac"
  | "transmission"
  | "brakes"
  | "suspension";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
}

export interface Shop {
  id: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface PriceOffer {
  id: string;
  shopId: string;
  serviceId: string;
  carBrand: string;
  carModel: string;
  priceMin: number;
  priceMax: number;
  currency: "IRR";
  source: string;
  isReal: boolean;
  notes: string;
  createdAt: string;
}

export interface Review {
  id: string;
  shopId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Database {
  shops: Shop[];
  services: Service[];
  priceOffers: PriceOffer[];
  reviews: Review[];
}
