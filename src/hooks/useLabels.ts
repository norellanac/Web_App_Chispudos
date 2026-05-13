import { useTranslation } from 'react-i18next';
import { useBranding } from './useBranding';
import { FieldLabels, LabelSet, ProductServiceLabels, OrderLabels } from '../types/branding';

// Default labels (services marketplace) — used when fieldLabels is not yet loaded
const DEFAULT: FieldLabels = {
  preset: 'services_marketplace',
  productService: {
    entityName:       { en: 'Service',       es: 'Servicio' },
    entityNamePlural: { en: 'Services',      es: 'Servicios' },
    name:             { en: 'Service name',  es: 'Nombre del servicio' },
    description:      { en: 'Description',   es: 'Descripción' },
    price:            { en: 'Price',          es: 'Precio' },
    specialPrice:     { en: 'Special price', es: 'Precio especial' },
    location:         { en: 'Location',       es: 'Ubicación' },
    provider:         { en: 'Professional',  es: 'Profesional' },
    providerPlural:   { en: 'Professionals', es: 'Profesionales' },
    details:          { en: 'Details',        es: 'Detalles' },
    serviceAreas:     { en: 'Service areas', es: 'Áreas de servicio' },
    rating:           { en: 'Rating',         es: 'Calificación' },
  },
  order: {
    entityName:       { en: 'Order',        es: 'Orden' },
    entityNamePlural: { en: 'Orders',       es: 'Órdenes' },
    totalAmount:      { en: 'Total',        es: 'Total' },
    startDate:        { en: 'Start date',   es: 'Fecha de inicio' },
    endDate:          { en: 'End date',     es: 'Fecha de fin' },
    comment:          { en: 'Notes',        es: 'Notas' },
    quantity:         { en: 'Quantity',     es: 'Cantidad' },
    unitPrice:        { en: 'Unit price',   es: 'Precio unitario' },
    discount:         { en: 'Discount',     es: 'Descuento' },
    charge:           { en: 'Extra charge', es: 'Cargo extra' },
    actions: {
      create:  { en: 'Book service',  es: 'Contratar servicio' },
      cancel:  { en: 'Cancel',        es: 'Cancelar' },
      confirm: { en: 'Confirm',       es: 'Confirmar' },
    },
    statuses: {
      pending:    { en: 'Pending',     es: 'Pendiente' },
      confirmed:  { en: 'Confirmed',   es: 'Confirmada' },
      inProgress: { en: 'In progress', es: 'En progreso' },
      completed:  { en: 'Completed',   es: 'Completada' },
      cancelled:  { en: 'Cancelled',   es: 'Cancelada' },
    },
  },
};

const pick = (set: LabelSet, lang: string): string =>
  lang.startsWith('es') ? set.es : set.en;

const resolveSection = <T extends Record<string, any>>(section: T, lang: string): Record<string, any> =>
  Object.fromEntries(
    Object.entries(section).map(([k, v]) => {
      if (v && typeof v === 'object' && 'en' in v && 'es' in v) return [k, pick(v as LabelSet, lang)];
      if (v && typeof v === 'object') return [k, resolveSection(v, lang)];
      return [k, v];
    })
  );

export interface ResolvedProductServiceLabels {
  entityName: string; entityNamePlural: string;
  name: string; description: string;
  price: string; specialPrice: string;
  location: string; provider: string; providerPlural: string;
  details: string; serviceAreas: string; rating: string;
}

export interface ResolvedOrderLabels {
  entityName: string; entityNamePlural: string;
  totalAmount: string; startDate: string; endDate: string;
  comment: string; quantity: string; unitPrice: string;
  discount: string; charge: string;
  actions: { create: string; cancel: string; confirm: string };
  statuses: { pending: string; confirmed: string; inProgress: string; completed: string; cancelled: string };
}

export const useLabels = () => {
  const { i18n } = useTranslation();
  const { config } = useBranding();
  const lang = i18n.language || 'en';
  const raw = config?.fieldLabels ?? DEFAULT;

  const productService = resolveSection(raw.productService, lang) as ResolvedProductServiceLabels;
  const order = resolveSection(raw.order, lang) as ResolvedOrderLabels;

  return { productService, order, preset: raw.preset };
};
