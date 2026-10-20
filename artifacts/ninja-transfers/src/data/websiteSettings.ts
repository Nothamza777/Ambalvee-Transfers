import { DEFAULT_WEBSITE_COPY, type WebsiteCopyOverrides } from './siteCopy';

export interface LoginEvent {
  userId: string;
  at: string;
}

export interface WebsiteSettings {
  logoUrl: string;
  brandName: string;
  brandSuffix: string;
  brandTagline: string;
  utilityNavLabel: string;
  searchPlaceholder: string;
  topDispatchText: string;
  topGuaranteeText: string;
  topShippingText: string;
  offerLabel: string;
  offerLead: string;
  offerTail: string;
  offerExpiredText: string;
  offerEndsAt: string;
  offerShippingText: string;
  offerGuaranteeText: string;
  reviewRating: string;
  reviewCount: string;
  heroHeadlineLead: string;
  heroRotatingWords: string;
  heroDescription: string;
  heroGuarantees: string[];
  heroPrimaryButton: string;
  heroSecondaryButton: string;
  heroSampleButton: string;
  heroShippingNote: string;
  featuredCtaButton: string;
  industrySectionHeading: string;
  siteCopy: WebsiteCopyOverrides;
}

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  logoUrl: '',
  brandName: 'AMBALVEE',
  brandSuffix: 'TRANSFERS',
  brandTagline: 'DTF transfers for apparel decorators',
  utilityNavLabel: 'CUSTOM DTF',
  searchPlaceholder: 'Search transfers, blanks, gang sheets, patches...',
  topDispatchText: 'Custom transfers and print-shop supplies',
  topGuaranteeText: 'Artwork and order tools for your workflow',
  topShippingText: 'Shipping options shown at checkout',
  offerLabel: 'NINJA TRANSFERS',
  offerLead: '',
  offerTail: '',
  offerExpiredText: 'A clear catalog for your next production run.',
  offerEndsAt: '',
  offerShippingText: 'Shipping options shown at checkout',
  offerGuaranteeText: 'Product details are editable examples',
  reviewRating: '',
  reviewCount: '',
  heroHeadlineLead: 'DTF TRANSFERS,',
  heroRotatingWords: 'GANG SHEETS\nCUSTOM PRINTS\nSHOP SUPPLIES',
  heroDescription: 'Order ready-to-press transfers, build a gang sheet, or source apparel and print-shop essentials. Clear product details and practical tools keep your next run moving.',
  heroGuarantees: [
    'Shop individual transfers or gang sheets',
    'Choose from the editable sample catalog',
    'Review shipping options at checkout'
  ],
  heroPrimaryButton: 'Order Custom Gang Sheets',
  heroSecondaryButton: 'Order Transfers by Size',
  heroSampleButton: 'Order $1.00 DTF Sample Pack',
  heroShippingNote: 'Shipping details are shown at checkout',
  featuredCtaButton: 'Shop Custom Gang Sheets',
  industrySectionHeading: 'TOOLS FOR YOUR NEXT PRINT RUN',
  siteCopy: DEFAULT_WEBSITE_COPY
};
