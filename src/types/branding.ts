export interface BrandingColors {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  error: string;
  errorContainer: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  onPrimary: string;
  onSecondary: string;
  onTertiary: string;
}

export interface IntroSlide {
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export interface BrandingFeatures {
  chatEnabled: boolean;
  tasksEnabled: boolean;
  newsletterEnabled: boolean;
  socialAuthEnabled: boolean;
  darkModeEnabled: boolean;
  biometricsEnabled: boolean;
}

export interface BrandingConfig {
  id: number;
  appName: string;
  tagline: string;
  legalName: string;
  logoUrl: string | null;
  iconUrl: string | null;
  splashUrl: string | null;
  faviconUrl: string | null;
  defaultImageUrl: string | null;
  sliderImages: string[];
  introSlides: IntroSlide[];
  appStoreUrl: string;
  playStoreUrl: string;
  colorsLight: BrandingColors;
  colorsDark: BrandingColors;
  fontFamily: string;
  buttonBorderRadius: number;
  termsUrl: string;
  privacyUrl: string;
  supportUrl: string;
  privacyEmail: string;
  legalEmail: string;
  companyAddress: string;
  mailchimpApiUrl: string;
  features: BrandingFeatures;
  copyOverrides: Record<string, Record<string, string>>;
  fieldLabels: FieldLabels | null;
}

export interface LabelSet { en: string; es: string; }

export interface ProductServiceLabels {
  entityName: LabelSet; entityNamePlural: LabelSet;
  name: LabelSet; description: LabelSet;
  price: LabelSet; specialPrice: LabelSet;
  location: LabelSet; provider: LabelSet; providerPlural: LabelSet;
  details: LabelSet; serviceAreas: LabelSet; rating: LabelSet;
}

export interface OrderLabels {
  entityName: LabelSet; entityNamePlural: LabelSet;
  totalAmount: LabelSet; startDate: LabelSet; endDate: LabelSet;
  comment: LabelSet; quantity: LabelSet; unitPrice: LabelSet;
  discount: LabelSet; charge: LabelSet;
  actions: { create: LabelSet; cancel: LabelSet; confirm: LabelSet; };
  statuses: {
    pending: LabelSet; confirmed: LabelSet; inProgress: LabelSet;
    completed: LabelSet; cancelled: LabelSet;
  };
}

export type PresetKey = 'services_marketplace' | 'rental' | 'rideshare' | 'ecommerce' | 'custom';

export interface FieldLabels {
  preset: PresetKey;
  productService: ProductServiceLabels;
  order: OrderLabels;
}
