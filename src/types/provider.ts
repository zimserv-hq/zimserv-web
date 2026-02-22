// src/types/provider.ts
export type ProviderService = {
  name: string;
  price: number | null;
};

export type ProviderGalleryImage = {
  id: string;
  url: string;
};

export type ProviderWorkingHours = {
  weekdays?: string;
  weekends?: string;
  emergency?: string;
};

export type ProviderContact = {
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
};

export type ProviderPublic = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline?: string;
  description: string;
  city: string;
  areas: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  verificationLevel: string;
  yearsExperience: number;
  pricing?: string;
  priceLabel?: string;
  pricingSummary?: string;
  contact: ProviderContact;
  services: ProviderService[];
  languages: string[];
  workingHours?: ProviderWorkingHours;
  gallery: ProviderGalleryImage[];
  stats: {
    jobsCompleted: number;
    responseTime?: string;
    repeatCustomers?: number;
  };
};
