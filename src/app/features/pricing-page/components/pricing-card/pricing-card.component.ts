import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { PricingCardData } from '../../interfaces/pricing-card.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pricing-card',
  imports: [ButtonModule, BadgeModule, CurrencyPipe],
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.css',
})
export class PricingCardComponent {
  readonly pricingCardData = input<PricingCardData>();
}
