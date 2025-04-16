import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { PricingCardData } from './interfaces/pricing-card.interface';
import { PricingCardComponent } from './components/pricing-card/pricing-card.component';

@Component({
  selector: 'app-pricing-page',
  imports: [ButtonModule, BadgeModule, PricingCardComponent],
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.css',
})
export class PricingPageComponent {
  basePricingCard: PricingCardData = {
    name: 'Option Name',
    price: 9,
    features: [
      { name: 'All standard elements included', included: true },
      { name: 'Over 1800 Components', included: true },
      { name: 'Best Figma techniques', included: true },
      // { name: 'Up to 10 design editors', included: true },
      // { name: 'Email support', included: true },
    ],
  };

  // Static data
  pricingCardList: PricingCardData[] = [
    {
      ...this.basePricingCard,
      features: [
        ...this.basePricingCard.features,
        { name: 'Up to 10 design editors', included: false },
        { name: 'Email support', included: false },
      ],
    },
    {
      ...this.basePricingCard,
      price: 19,
      features: [
        ...this.basePricingCard.features,
        { name: 'Up to 10 design editors', included: true },
        { name: 'Email support', included: true },
      ],
      isPopular: true,
    },
    {
      ...this.basePricingCard,
      price: 29,
      features: [
        ...this.basePricingCard.features,
        { name: 'Up to 10 design editors', included: true },
        { name: 'Email support', included: true },
      ],
    },
  ];
}
