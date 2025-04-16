export interface PricingCardData {
  name: string;
  price: number;
  features: { name: string; included: boolean }[];
  isPopular?: boolean;
}
